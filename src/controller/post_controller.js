// Import model
const Posts = require('../model/post_model');
const moment = require('moment');

// Create CRUD function:
// Create new post
exports.compose = (req, res) => {
    if(!req.body){
        res.status(400).send({
            message: "No data received"
        });
    }

    const {studid_fld, content_fld, date_created_TS_fld} = req.body;
 
    let img_fld = "";

    if (!req.file) {
        const post = new Posts({
            studid_fld : req.body.studid_fld,
            content_fld : req.body.content_fld,
            date_created_TS_fld : moment().format(),
        }); 
    
        // Save students in the database
        Posts.create(post, (err, data) => {
            if(err){
                res.status(500).send({
                    message: err.message || "Errors found while create new student",
                });
            }
            res.send(data); 
        });

    }else{
        
        img_fld = req.file.filename;

        const post = new Posts({
            studid_fld : req.body.studid_fld,
            content_fld : req.body.content_fld,
            img_fld :  req.file.filename,
            date_created_TS_fld : moment().format(),
        }); 

        // Save students in the database
        Posts.create(post, (err, data) => {
            if(err){
                res.status(500).send({
                    message: err.message || "Errors found while create new student",
                });
            }

            res.send(data); 
        });
    }
 


};


// Retrive all posts
exports.findAll = (req, res) => {
    Posts.getAll((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while retrieving all posts"
            });
        }
        res.send(data);
    });
} 

// Count Posts
exports.getTotalPosts = (req, res) => {
    Posts.countPosts((err, data) => {
        if(err){
            res.sendStatus(500).send({
                message: err.message || "Errors found while retrieving total_posts"
            });
        }
        res.send(data);
    });
} 
// Count Comments
exports.countComments = (req, res) => {
    Posts.getComments((err, data) => {
        if(err){
            res.sendStatus(500).send({
                message: err.message || "Errors found while retrieving all comments"
            });
        }
        res.send(data);
    });
} 
// Count likes
// exports.countLikes = (req, res) => {
//     Posts.getTotalLikesByPostId((err, data) => {
//         if(err){
//             res.sendStatus(500).send({
//                 message: err.message || "Errors found while retrieving all comments"
//             });
//         }
//         res.send(data);
//     });
// } 

// Find posts with studid_id
exports.findPostByStudid = (req, res) => {
    Posts.findByStudid(req.params.studid_fld, (err, data) => { 
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.studid_fld}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving student by id: ${req.params.studid_fld}`});
       }
        res.send(data);
    })

}

// Find posts with post_uid
exports.findPostById = (req, res) => {
    Posts.findByPostId(req.params.post_uid, (err, data) => { 
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.post_uid}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving student by id: ${req.params.post_uid}`});
       }
        res.send(data);
    })

}

// Update post by Id
exports.update = (req, res) => {
    if(!req.body){
        res.status(400).send({message: "Not data received"});
    }

    const {studid_fld, content_fld, date_created_TS_fld} = req.body;
 
    let img_fld = "";

    if (!req.file) {
        const post = new Posts({
        studid_fld : req.body.studid_fld,
        content_fld : req.body.content_fld,
        has_links_fld : req.body.has_links_fld,
        edited_At_fld : moment().format(),
        date_created_TS_fld : req.body.date_created_TS_fld,
        deleted_At_fld : req.body.deleted_At_fld
    });

    Posts.updateById(req.params.post_uid, post, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({message: `Record not found: ${req.params.post_uid}`});
            }
            res.status(500).send({
                message: err.message || `Error updating post with post_uid ${req.params.post_uid}`,
            });
        }
        res.send(data);
    });
    }else{
        img_fld = req.file.filename;

        const post = new Posts({
            studid_fld : req.body.studid_fld,
            content_fld : req.body.content_fld,
            has_links_fld : req.body.has_links_fld, 
            img_fld :  req.file.filename,
            edited_At_fld : moment().format(),
            date_created_TS_fld : req.body.date_created_TS_fld,
            deleted_At_fld : req.body.deleted_At_fld
        });
    
        Posts.updateById(req.params.post_uid, post, (err, data) => {
            if(err){
                if(err.kind === "not_found"){
                    res.status(404).send({message: `Record not found: ${req.params.post_uid}`});
                }
                res.status(500).send({
                    message: err.message || `Error updating post with post_uid ${req.params.post_uid}`,
                });
            }
            res.send(data);
        });
    }

};

// delete post
exports.delete = (req, res) => {
    if(!req.body){
        res.status(400).send({message: "Not data received"});
    }

    const post = new Posts({
        studid_fld : req.body.studid_fld,
        content_fld : req.body.content_fld,
        has_links_fld : req.body.has_links_fld,
        edited_At_fld : req.body.edited_At_fld,
        date_created_TS_fld : req.body.date_created_TS_fld,
        deleted_At_fld : moment().format()
    });

    Posts.removeById(req.params.post_uid, post, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({message: `Record not found: ${req.params.post_uid}`});
            }
            res.status(500).send({
                message: err.message || `Could not delete post with post_uid ${req.params.post_uid}`,
            });
        }
        res.send({message: `Post ${req.params.post_uid} was deleted successfully`, data: data})
    });
};

exports.postLiked = (req, res) => {
    if(!req.body){
        res.status(400).send({message: "Not data received"});
    }

    const post = new Posts(
    {
        post_uid: req.params.post_uid,
        studid_fld : req.body.studid_fld,
        isLiked_fld : req.body.isLiked_fld,
        date_created_TS_fld: moment().format()
    });

    Posts.insertLike(post, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while liking post",
            });
        }
        
        Posts.postLike( req.params.post_uid, (err, data) => {
            if(err){
                if(err.kind === "not_found"){
                    res.status(404).send({message: `Record not found: ${req.params.post_uid}`});
                }
                res.status(500).send({
                    message: err.message || `Error updating liked post with post_uid ${req.params.post_uid}`,
                });
            }
            res.send(data);
        });
        
         
    });
    

};

//dislike post
exports.postDisliked = (req, res) => {

    Posts.dislike(req.params.like_uid, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while liking post",
            });
        }

        Posts.postDislike( req.params.post_uid, (err, data) => {
            if(err){
                if(err.kind === "not_found"){
                    res.status(404).send({message: `Record not found: ${req.params.post_uid}`});
                }
                res.status(500).send({
                    message: err.message || `Error updating disliked post with post_uid ${req.params.post_uid}`,
                });
            }
            res.send(data);
        });
    });
    

};



// Find post likes with post_uid
exports.findAllLikes = (req, res) => {
    Posts.getLikes(req.params.post_uid, (err, data) => { 
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.post_uid}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving student by id: ${req.params.post_uid}`});
       }
        res.send(data);
    })

}

// Find posts with studid_id
exports.findAllLikesById = (req, res) => {
    Posts.getLikesByStudent(req.params.studid_fld, (err, data) => { 
       if(err) {
           if(err.kind === "not_found"){
               res.status(404).send({
                   message: `Record not found: ${req.params.studid_fld}`
               });
           }
           res.send(500).send({ message: err.message || `Errors found while retireving student by id: ${req.params.studid_fld}`});
       }
       if(!data){
        res.status(404).send({
            message: `Record no data: ${req.params.studid_fld}`
        });
        
       }
        res.send(data);
    })

}
// if(data){

        //     Posts.updateLike(req.params.post_uid, post, (err, data) => {
        //         if(err){
        //             if(err.kind === "not_found"){
        //                 res.status(404).send({message: `Record not found: ${req.params.post_uid}`});
        //             }
        //             res.status(500).send({
        //                 message: err.message || `Could not like the post with post_uid ${req.params.post_uid}`,
        //             });
        //         }
        //         res.send({message: `Post ${req.params.post_uid} was liked successfully`, data: data})
        //     });
        // }

// get all liked posts
exports.findAllPostLikes = (req, res) => {
    Posts.getAllPostLikes((err, data) => {
        if(err){
            res.sendStatus(500).send({
                message: err.message || "Errors found while retrieving all liked posts"
            });
        }
        res.send(data);
    });
} 
// get max likes
exports.trends = (req, res) => {
    Posts.maxLikes((err, data) => {
        if(err){
            res.sendStatus(500).send({
                message: err.message || "Errors found while retrieving all posts"
            });
        }
        res.send(data);
    });
} 

//upload img
exports.fileUpload = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Not data received" });
    }
  
    const post = new Posts({
      post_uid: req.params.post_uid,
      img_fld: req.file.filename
    });
    
    Posts.updateFile(req.params.post_uid, post, (err, data) => {
      if (err) {
        res.status(500).json({
            message:
              err.message ||
              `Could not upload img with post_uid ${req.params.post_uid}`,
          });
      }
      if(req.file.filename){    
        res.status(201).json({
          message: "Image Upload successfully",
          url: req.file.filename
        });
      }
    });
  };