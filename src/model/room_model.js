const sql = require('./db_model');

const Rooms = function(rooms){
    this.room_uid = rooms.room_uid,
    this.rname_fld = rooms.rname_fld,
    this.is_unauthorized_fld = rooms.is_unauthorized_fld,
    this.is_created_at_fld = rooms.is_created_at_fld

    // members
    this.room_members_uid = rooms.room_members_uid,
    this.studid_fld = rooms.studid_fld,
    this.is_left_fld = rooms.is_left_fld,

    // message
    this.message_fld = rooms.message_fld,
    this.is_created_at_fld = rooms.is_created_at_fld
}

// ROOM

Rooms.create = (room, result) => {
    let query = sql.format('INSERT INTO ?? SET rname_fld = ?, is_created_at_fld = ?', 
    [
        'rooms_tbl',
        room.rname_fld,
        room.is_created_at_fld
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        } 
        console.log('created room: ', {room_uid: res.insertId, rname_fld: room.rname_fld, is_created_at_fld: room.is_created_at_fld});
        result(null, {room_uid: res.insertId, rname_fld: room.rname_fld, is_created_at_fld: room.is_created_at_fld});
    });
};

Rooms.addMembers = (member, result) => {
    let query = sql.format('INSERT INTO ?? SET studid_fld = ?, room_uid = ?',
    [
        'room_members_tbl',
        member.studid_fld,
        member.room_uid 
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        } 

        console.log('add member: ', {room_member_uid: res.insertId, studid_fld: member.studid_fld, room_uid: member.room_uid});
        result(null, {room_member_uid: res.insertId, studid_fld: member.studid_fld, room_uid: member.room_uid});
    });
};

Rooms.getMemberID = (room_uid, result) => {
    let query = sql.format('SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE room_uid = ? AND is_left_fld = 0', 
    [
        'room_members_tbl',
        'students_tbl',
        room_uid
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log('members: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    })
}

Rooms.getMembers = (result) => {
    let query = sql.format('SELECT * FROM ?? WHERE is_left_fld = 0',  
    [
        'room_members_tbl'
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log('rooms: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    })
}

Rooms.getRooms = (result) => {
    let query = sql.format('SELECT * FROM ?? WHERE is_unauthorized_fld = 0', 
    [
        'rooms_tbl'
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log('rooms: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    })
}

Rooms.getRoomId = (rname_fld, result) => {
    let query = sql.format('SELECT room_uid FROM ?? WHERE rname_fld = ? AND is_unauthorized_fld = 0 ORDER BY is_created_at_fld DESC LIMIT 1', 
    [
        'rooms_tbl',
        rname_fld
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log('members: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    })
}

Rooms.getGroups = (room_uid, room, result) => {
    let query = sql.format('SELECT * FROM ?? INNER JOIN ?? USING (room_uid) WHERE room_uid = ? AND studid_fld = ?', 
    [
        'room_members_tbl',
        'rooms_tbl',
        room_uid,
        room.studid_fld
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log('groups: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null); 
    })
}
Rooms.getRoomByID = (room_uid, result) => {
    let query = sql.format('SELECT * FROM ?? WHERE room_uid = ?', 
    [
        'rooms_tbl',
        room_uid
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log('groups: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    })
}

Rooms.removeRoomById = (studid_fld, result) => {
    let query =  sql.format(`UPDATE ?? SET is_left_fld = 1 WHERE  studid_fld = ?`,     
    [
        'room_members_tbl', 
        studid_fld
    ]);
    sql.query(query, (err, res) => {        
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }        

        console.log('leave room: ', {studid_fld: studid_fld});
        result(null, {studid_fld: studid_fld});
    });
}

//MESSAGE

Rooms.newMessage = (message, result) => {
    let query = sql.format('INSERT INTO ?? SET room_uid = ?, studid_fld = ?, message_fld = ?, is_created_at_fld = ?', 
    [
        'room_messages_tbl',
        message.room_uid,
        message.studid_fld,
        message.message_fld,
        message.is_created_at_fld
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        } 

        console.log('created comment: ', {room_uid: res.insertedId, ...message});
        result(null, {room_uid: res.insertedId, ...message});
    });
};

Rooms.getMessage = (room_uid, result) => {
    let query = sql.format('SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE room_uid = ?', [
        'room_messages_tbl',
        'students_tbl',
        room_uid
    ])
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log('message: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    })
}

module.exports = Rooms;