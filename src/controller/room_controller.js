const Rooms = require('../model/room_model');
const moment = require('moment');

exports.createRoom = (req, res) => {
    
    if(!req.body){
        res.status(400).send({message: 'No data received'});
    }

    const room = new Rooms({
        rname_fld : req.body.rname_fld,
        objective_fld: req.body.objective_fld,
        requested_by_fld: req.body.requested_by_fld, 
        is_created_at_fld : moment().format()
    });
    
    Rooms.create(room, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Errors found while create new room'
            });
        }
        console.log('data', data)
         res.send(data);   
    });
    
}

exports.newMember = (req, res) => {
    
    if(!req.body){
        res.status(400).send({message: 'No data received'});
    }

    const member = new Rooms({
      studid_fld : req.body.studid_fld,
      room_uid : req.body.room_uid
    });
    
    Rooms.addMembers(member, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Errors found while create new room'
            });
        }
          
        res.send(data);
    });
    
}

exports.members = (req, res) => {
    Rooms.getMemberID(req.params.room_uid, (err, data) => { 
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.room_uid}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving members by room_uid: ${req.params.room_uid}`});
       }
        res.send(data);
    })

}
exports.roomid = (req, res) => {
    Rooms.getRoomId(req.body.rname_fld, (err, data) => { 
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.rname_fld}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving roomid by room_uid: ${req.body.rname_fld}`});
       }
        res.send(data);
    })

}

exports.groups = (req, res) => {
    const group = new Rooms({
        studid_fld : req.body.studid_fld
      });

    Rooms.getGroups(req.params.room_uid, group, (err, data) => { 
        if(!data){
            res.status(404).send({
                message: `Record not found: ${req.params.room_uid}`
            });
        }
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.room_uid}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving members by room_uid: ${req.params.room_uid}`});
       }
        res.send(data);
    })

}
exports.roomName = (req, res) => {
    Rooms.getRoomByID(req.params.room_uid, (err, data) => { 
        if(!data){
            res.status(404).send({
                message: `Record not found: ${req.params.room_uid}`
            });
        }
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.room_uid}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving members by room_uid: ${req.params.room_uid}`});
       }
        res.send(data);
    })

}

exports.findRooms = (req, res) => {
    Rooms.getRooms((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while retrieving all rooms"
            });
        }
        res.send(data);
    });
} 
exports.findUnauthorized = (req, res) => {
    Rooms.getUnauthorized((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while retrieving all unauthorized"
            });
        }
        res.send(data);
    });
} 
exports.findAuthorized = (req, res) => {
    Rooms.getAuthorized((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while retrieving all authorized"
            });
        }
        res.send(data);
    });
} 
exports.findAllMembers = (req, res) => { 
    Rooms.getMembers((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while retrieving all members"
            });
        }
        res.send(data);
    });
} 
exports.findAllLeftMembers = (req, res) => { 
    Rooms.getLeftMembers((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while retrieving all members"
            });
        }
        res.send(data);
    });
} 

exports.leaveRoom = (req, res) => {
    
    Rooms.removeRoomById(req.params.studid_fld, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while leaving room",
            });
        }

       res.send(data)
    });
    
    
};

exports.joinRoom = (req, res) => {

    Rooms.joinRoomById(req.params.studid_fld, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while leaving room",
            });
        }

       res.send(data)
    });
    

};
//MESSAGE 
exports.message = (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'No data received'});        
    }

    const message = new Rooms({
        room_uid: req.params.room_uid,
        studid_fld: req.body.studid_fld,
        message_fld: req.body.message_fld,
        is_created_at_fld: moment().format()
    })

    Rooms.newMessage(message, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Errors found while create new room'
            });
        }
        res.send(data);
    });
}

exports.findMessage = (req, res) => {
    
    Rooms.getMessage(req.query.room_uid, (err, data) => { 
        if(!data){
            res.status(404).send({
                message: `Record not found: ${req.params.room_uid}`
            });
        }
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.room_uid}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving members by room_uid: ${req.params.room_uid}`});
       }
        res.send(data);
    })

}

// Update room by Id
exports.update = (req, res) => {
    if(!req.body){
        res.status(400).send({message: "Not data received"});
    }

    const room = new Rooms({
        is_unauthorized_fld: req.body.is_unauthorized_fld
    });

    Rooms.updateById(req.params.room_uid, room, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({message: `Record not found: ${req.params.room_uid}`});
            }
            res.status(500).send({
                message: err.message || `Error updating post with post_uid ${req.params.room_uid}`,
            });
        }
        res.send(data);
    });
};