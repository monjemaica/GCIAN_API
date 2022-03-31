// import sql
const sql = require('./db_model');

// constractor for new comment
const Comments = function(comments){
    this.comment_uid = comments.comment_uid,
    this.post_uid = comments.post_uid,
    this.studid_fld = comments.studid_fld,
    this.content_fld = comments.content_fld,
    this.date_created_TS_fld = comments.date_created_TS_fld,
    this.updated_At_fld = comments.updated_At_fld,
    this.deleted_At_fld = comments.deleted_At_fld
}

// create comment 
Comments.create = (newComment, result) => {
    let query = sql.format('INSERT INTO ?? SET ?', ['comments_tbl', newComment])
    sql.query(query, (err, res) => {
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
    let query = sql.format('SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE post_uid = ? AND is_deleted_fld = 0 ORDER BY date_created_TS_fld ASC',
    [
        'comments_tbl',
        'students_tbl',
        post_uid
    ]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err); 
            result(err, null);
            return;
        }
        if(res.length){
            console.log('comments: ', res)
            result(null, res);
            return;
        }
        result({kind:"not_found"}, null);
    });
}

// update comment by id
Comments.updateById = (comment_uid, comment, result) => {
    let query = sql.format('UPDATE ?? SET content_fld = ?, updated_At_fld = ? WHERE comment_uid = ?',
    [
        'comments_tbl',
        comment.content_fld,
        comment.updated_At_fld,
        comment_uid
    ]);
    sql.query(query,
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

        console.log('update comment: ', {comment_uid: comment_uid, ...comment});
        result(null, {comment_uid: comment_uid, ...comment});
    });
};

// delete comment by id
Comments.removeById = (comment_uid, comment, result) => {
    let query = sql.format("UPDATE ?? SET deleted_At_fld = ?, is_deleted_fld = 1 WHERE comment_uid = ?", ['comments_tbl', comment.deleted_At_fld, comment_uid]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(null, err);
            return;
        }

        if(res.affectedRows == 0){
            result({kind: "not_found"}, null);
            return;
        }

        console.log('updated comment: ', {comment_uid: comment_uid, ...comment});
        result(null, {message: 'Record Deleted', comment_uid: comment_uid, ...comment});
    }
    )
}

module.exports = Comments;