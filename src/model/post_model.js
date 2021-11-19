const sql = require('./db_model');

// Create Constructor
const Posts = function(posts){
    this.post_uid = posts.post_uid,
    this.studid_fld = posts.studid_fld,
    this.content_fld = posts.content_fld,
    this.has_links_fld = posts.has_links_fld,
    this.edited_At_fld = posts.edited_At_fld,
    this.date_created_TS_fld = posts.date_created_TS_fld,
    this.deleted_At_fld = posts.deleted_At_fld
}

// Add post
Posts.create = (newPost, result) => {
    sql.query('INSERT INTO posts_tbl SET ?', newPost, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }
        
        console.log('created post: ', {post_uid: res.insertedId, ...newPost});
        result(null, {post_uid: res.insertedId, ...newPost});
    });
};

// Get all posts
Posts.getAll = (result) => {
    sql.query("SELECT * FROM posts_tbl INNER JOIN students_tbl USING (studid_fld) WHERE is_deleted_fld = 0 ORDER BY date_created_TS_fld DESC",
     (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        console.log('posts: ', res);
        result(null, res);
    });
};

// Get all posts by studid
Posts.findById = (studid_fld, result) => {
    sql.query(`SELECT * FROM posts_tbl INNER JOIN students_tbl USING (studid_fld) WHERE studid_fld = '${studid_fld}' AND is_deleted_fld = 0 ORDER BY date_created_TS_fld DESC`,
    (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err,null);
            return;
        }

        if(res.length){
            console.log('post: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    });
};

// Update post by Id
Posts.updateById = (post_uid, post, result) => {
    sql.query("UPDATE posts_tbl SET content_fld= ?, has_links_fld= ?, edited_At_fld= ? WHERE post_uid= ?",
    [
        post.content_fld,
        post.has_links_fld,
        post.edited_At_fld,
        post_uid
    ],
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

        console.log('update post: ', {post_uid: post_uid, ...post});
        result(null, {post_uid: post_uid, ...post})
    }
    )
}

// Delete post
Posts.removeById = (post_uid, post, result) => {
    sql.query("UPDATE posts_tbl SET is_deleted_fld = 1 WHERE post_uid = ?",
    [post_uid],
    (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(null, err);
            return;
        }

        if(res.affectedRows == 0){
            result({kind: "not_found"}, null);
            return;
        }

        console.log('edited post: ', {post_uid: post_uid, ...post});
        result(null, {message: 'Record Deleted'});
    }
    )
}

// exports posts

module.exports = Posts; 