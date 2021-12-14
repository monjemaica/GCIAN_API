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
    this.isLiked_fld = posts.isLiked_fld
    
}

// Add post
Posts.create = (post, result) => {
    let query =  sql.format('INSERT INTO ?? SET studid_fld = ?, content_fld = ?, date_created_TS_fld = ?', ['posts_tbl', post.studid_fld, post.content_fld, post.date_created_TS_fld]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }
        
        console.log('created post: ', {post_uid: res.insertedId, ...post}); 
        result(null, {post_uid: res.insertedId, ...post});
    });
}; 

// Get all posts
Posts.getAll = (result) => {
    let query =  sql.format("SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE is_deleted_fld = 0 ORDER BY date_created_TS_fld DESC", ['posts_tbl','students_tbl']);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        console.log('posts: ', res);
        result(null, res);
    });
};

// Count Comments
Posts.getComments = (result) => {
    let query =  sql.format("SELECT posts_tbl.post_uid, posts_tbl.content_fld, posts_tbl.date_created_TS_fld, COUNT(posts_tbl.post_uid) AS total_comments FROM ?? JOIN ?? WHERE posts_tbl.post_uid = comments_tbl.post_uid AND posts_tbl.is_deleted_fld = 0 AND comments_tbl.is_deleted_fld = 0 GROUP BY posts_tbl.post_uid ORDER BY date_created_TS_fld DESC",
     ['posts_tbl','comments_tbl']);
    sql.query(query, (err, res) => {
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
Posts.findByStudid = (studid_fld, result) => {
    let query =  sql.format('SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE studid_fld = ? AND is_deleted_fld = 0 ORDER BY date_created_TS_fld DESC', ['posts_tbl', 'students_tbl', studid_fld]);
    sql.query(query, (err, res) => {
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

// Get posts by post_uid
Posts.findByPostId = (post_uid, result) => {
    let query =  sql.format('SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE post_uid = ? AND is_deleted_fld = 0', ['posts_tbl', 'students_tbl', post_uid]);
    sql.query(query, (err, res) => {
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
    let query = sql.format("UPDATE ?? SET content_fld= ?, has_links_fld= ?, edited_At_fld= ? WHERE post_uid= ?", 
    [
        'posts_tbl', 
        post.content_fld,
        post.has_links_fld,
        post.edited_At_fld,
        post_uid
    ]);
    sql.query(query, (err, res) => {
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
    });
};

// Delete post
Posts.removeById = (post_uid, post, result) => {
    let query = sql.format("UPDATE ?? SET deleted_At_fld = ?, is_deleted_fld = 1 WHERE post_uid = ?", ['posts_tbl', post.deleted_At_fld, post_uid]);
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

        console.log('updated post: ', {post_uid: post_uid, ...post});
        result(null, {message: 'Record Deleted', post_uid: post_uid, ...post});
    }
    )
}

// post likes
Posts.insertLike = (post, result) => {
    let query =  sql.format(`INSERT INTO ?? (post_uid, studid_fld, isLiked_fld, date_created_TS_fld) SELECT * FROM (SELECT ?, ?, 1, ?) AS tmp WHERE NOT EXISTS ( SELECT post_uid FROM likes_tbl WHERE post_uid = ? ) OR NOT EXISTS( SELECT studid_fld FROM likes_tbl WHERE studid_fld = ?) LIMIT 1`,  ['likes_tbl', post.post_uid, post.studid_fld, post.date_created_TS_fld, post.post_uid, post.studid_fld]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }
        if(res.affectedRows == 1){
            console.log('post already liked: ', {post_uid: res.insertedId, ...post});
            result(null, {message:'post already liked',post_uid: res.insertedId, ...post});
            return;
        }
        
        console.log('like post: ', {post_uid: res.insertedId, ...post});
        result(null, {post_uid: res.insertedId, ...post});
    });
}

// Get all post likes by postid
Posts.getLikes = (post_uid, result) => {
    let query =  sql.format('SELECT * FROM ?? WHERE post_uid = ? AND isLiked_fld = 1 ORDER BY date_created_TS_fld DESC', ['likes_tbl',  post_uid]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err,null);
            return;
        }

        if(res.length){
            console.log('post likes: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    });
};

// Get all liked posts by studid 
Posts.getLikesByStudent = (studid_fld, result) => {
    let query =  sql.format('SELECT * FROM ?? INNER JOIN ?? USING (post_uid) WHERE likes_tbl.studid_fld = ? AND likes_tbl.isLiked_fld = 1 ORDER BY likes_tbl.date_created_TS_fld DESC', ['likes_tbl', 'posts_tbl',  studid_fld]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err,null);
            return; 
        }

        if(res.length){
            console.log('liked posts: ', res);
            result(null, res);
            return;
        }

        result({kind:"not_found"}, null);
    });
};


// Posts.updateLike = (post_uid, post, result) => {
//     let query = sql.format("UPDATE ?? SET isLiked_fld = ?, date_created_TS_fld = ? WHERE post_uid = ?", ['likes_tbl', post.isLiked_fld, post.date_created_TS_fld, post_uid]);
//     sql.query(query, (err, res) => {
//         if(err){
//             console.log('Error: ', err);
//             result(null, err);
//             return;
//         }

//         if(res.affectedRows == 0){
//             result({kind: "not_found"}, null);
//             return;
//         }

//         console.log('updated post: ', {post_uid: post_uid, ...post});
//         result(null, {message: 'Post liked', post_uid: post_uid, ...post});
//     })
// }

module.exports = Posts; 