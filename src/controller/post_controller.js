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

    // Create new object for post req.body
    const post = new Posts({
        studid_fld : req.body.studid_fld,
        content_fld : req.body.content_fld,
        has_links_fld : req.body.has_links_fld,
        edited_At_fld : req.body.edited_At_fld,
        date_created_TS_fld : moment().format(),
        deleted_At_fld : req.body.deleted_At_fld
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