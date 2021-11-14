// import model
const Comments = require('../model/comment_model');
const moment = require('moment');
const Posts = require('../model/post_model');

// create comment
exports.create = (req, res) => {
    console.log("test: ", req.params);
    if(!req.body){
        res.status(400).send({message: 'No data received'});
    }

    const comment = new Comments({
       post_uid : req.params.post_uid,
       content_fld : req.body.content_fld,
       date_created_TS_fld : moment().format()
    });
    
    Comments.create(comment, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Errors found while create new comment'
            });
        }
        res.send(data);
    });
    
}

// findAll comment
exports.findAll = (req, res) => {
    const post_uid = req.params.post_uid;

    Comments.getAll(post_uid, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Errors found while retrieving comments'
            });
        }
        res.send(data);
    });
};

// update comment
exports.updateById = (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Not data received'});
    }

    const comment = new Comments({
        content_fld : req.body.content_fld,
        updated_At_fld : moment().format()
    });

    Comments.updateById(req.params.comment_uid, comment, (err, data) => {
        if(err){
            if(err.kind === 'not_found'){
                res.status(404).send({message: `Record not found ${req.params.comment_uid}`});
            }
            res.status(500).send({
                message: err.message || `Error updating comment with comment_uid ${req.params.comment_uid}`,
            });
        }
        res.send(data);
    });
}

// delete comment 
exports.delete = (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Not data received'})
    }

    const comment = new Comments(req.body)

    Posts.removeById(req.params.comment_uid, comment, (err, data) => {
        if(err){
            if(err.kind === 'not_found'){
                res.status(404).send({message: `Record not found: ${req.params.comment_uid}`});
            }
            res.status(500).send({
                message: err.message || `Could not delete comment with comment_uid ${req.params.comment_uid}`
            });
        }
        res.send({message: `Comment ${req.params.comment_uid} was deleted successfully`})
    });
};