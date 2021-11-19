// import sql
const sql = require('./db_model');

// constractor for new comment
const Comments = function(comments){
    this.comment_uid = comments.comment_uid,
    this.post_uid = comments.post_uid,
    this.studid_fld = comments.studid_fld,
    this.content_fld = comments.content_fld,
    this.date_created_TS_fld = comments.date_created_TS_fld
}

// create comment 
Comments.create = (newComment, result) => {
    sql.query('INSERT INTO comments_tbl SET ?', newComment, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        } 

        console.log('created comment: ', {comment_uid: res.insertedId, ...newComment});
        result(null, {comment_uid: res.insertedId, ...newComment});
    });
};

// get all comments
Comments.getAll = (post_uid, result) => {
    sql.query(`SELECT * FROM comments_tbl WHERE post_uid = ${post_uid}`,
    (err, res) => {
        if(err){
            console.log('Error: ', err); 
            result(err, null);
            return;
        }
        if(res.length){
            console.log('comments: ', res)
            result(null, res);
        }
        
        result({kind: 'not_found'}, null) 
    });
}

// update comment by id
Comments.updateById = (comment_uid,comment, result) => {
    sql.query(`UPDATE comments_tbl SET content_fld = ?, updated_At_fld = ? WHERE comment_uid = ?`,
    [
        comment.content_fld,
        comment.updated_At_fld,
        comment_uid
    ],
    (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(null, err);
            return;
        }

        if(res.affectedRows ==0){
            result({kind: 'not_found'}, null);
            return;
        }

        console.log('update comment: ', {comment_uid: comment_uid, ...comment});
        result(null, {comment_uid: comment_uid, ...comment});
    });
};

// delete comment by id
Comments.removeById = (comment_uid, comment, result) => {
    sql.query('UPDATE comments_tbl SET is_deleted_fld = 1 WHERE comment_uid = ?',
    [comment_uid],
    (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(null, err);
            return;
        }

        if(res.affectedRows == 0){
            result({kind: 'not_found'}, null);
            return;
        }

        console.log('edited post: ', {comment_uid: comment_uid, ...comment});
        result(null, {comment_uid: comment_uid, ...comment})
    }
    )
}
module.exports = Comments;