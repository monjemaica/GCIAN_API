const sql = require('./db_model');

// Create Constructor
const Posts = function(posts){
    this.post_uid = posts.post_uid,
    this.studid_fld = posts.studid_fld,
    this.content_fld = posts.content_fld,
    this.has_links_fld = posts.has_links_fld,
    this.edited_At_fld = posts.edited_At_fld,
    this.date_created_TS_fld = posts.date_created_TS_fld,
    this.deleted_At_fld = posts.deleted_At_fld,
    this.img_fld = posts.img_fld,
    this.total_likes_fld = posts.total_likes_fld
    // likes table
    this.isLiked_fld = posts.isLiked_fld,
    this.like_uid = posts.like_uid
    
}

// Add post
Posts.create = (post, result) => {
    let query =  sql.format('INSERT INTO ?? SET studid_fld = ?, content_fld = ?, img_fld = ?, date_created_TS_fld = ?', ['posts_tbl', post.studid_fld, post.content_fld, post.img_fld ,post.date_created_TS_fld]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }
        
        console.log('created post: ', {post_uid: res.insertId}); 
        result(null, {post_uid: res.insertId});
    });
}; 

// Get all posts
Posts.getAll = (result) => {
    let query =  sql.format("SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE is_deleted_fld = 0 AND is_reported_fld = 0 ORDER BY date_created_TS_fld DESC", ['posts_tbl','students_tbl']);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        console.log('posts: ', res);
        if(res.length){
            console.log('posts: ', res);
            result(null, res);
            return;
        }
        
        result({kind:"not_found"}, null);
    });
};


// Count posts
Posts.countPosts = (result) => {
    let query =  sql.format("SELECT COUNT(posts_tbl.post_uid) AS total_posts FROM ?? JOIN ?? WHERE posts_tbl.studid_fld = students_tbl.studid_fld AND posts_tbl.is_deleted_fld = 0 ORDER BY date_created_TS_fld DESC",
     ['posts_tbl','students_tbl']);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }
        console.log('posts: ', res[0]);
        result(null, res[0]);
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
        if(res.length){
            console.log('posts: ', res);
            result(null, res);
            return;
        }
        
        result({kind:"not_found"}, null);
    });
};
// Count likes
// Posts.getTotalLikesByPostId = (result) => {
//     let query =  sql.format(`SELECT posts_tbl.post_uid ,posts_tbl.content_fld, posts_tbl.date_created_TS_fld, COUNT(posts_tbl.post_uid) AS total_likes FROM ?? JOIN ?? WHERE posts_tbl.post_uid = likes_tbl.post_uid AND posts_tbl.is_deleted_fld = 0 AND likes_tbl.isLiked_fld = 1 GROUP BY posts_tbl.post_uid ORDER BY date_created_TS_fld DESC`,
//      ['posts_tbl','likes_tbl']);
//     sql.query(query, (err, res) => {
//         if(err){
//             console.log('Error: ', err);
//             result(err, null);
//             return;
//         }
//         console.log('posts: ', res);
//         result(null, res);
//     });
// };



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
    let query = sql.format("UPDATE ?? SET content_fld= ?, has_links_fld= ?, edited_At_fld= ?, img_fld = ? WHERE post_uid= ?", 
    [
        'posts_tbl', 
        post.content_fld,
        post.has_links_fld,
        post.edited_At_fld,
        post.img_fld,
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



// post liked
Posts.insertLike = (post, result) => {
    let query =  sql.format(`INSERT INTO ?? SET post_uid = ?, studid_fld = ?, isLiked_fld = 1, date_created_TS_fld = ?`,     
    [
        'likes_tbl', 
        post.post_uid, 
        post.studid_fld, 
        post.date_created_TS_fld        
    ]);
    sql.query(query, (err, res) => {        
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }        
        if(res.affectedRows == 1){
            console.log('post already liked: ', {post_uid: res.insertId, ...post});
            result(null, {message:'post already liked',post_uid: res.insertId, ...post});
            return;
        }

        console.log('like post: ', {post_uid: res.insertId, ...post});
        result(null, {post_uid: res.insertId, ...post});
    });
}

// post disliked   
Posts.dislike = (like_uid, result) => {
    let query =  sql.format(`UPDATE ?? SET isLiked_fld = 0 WHERE like_uid = ?`,     
    [
        'likes_tbl', 
        like_uid
    ]);
    sql.query(query, (err, res) => {        
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }        
        if(res.affectedRows == 1){
            console.log('post already disliked: ', {like_uid: res.insertId});
            result(null, {message:'post already disliked',like_uid: res.insertId});
            return;
        }

        console.log('dislike post: ', {like_uid: res.insertId});
        result(null, {like_uid: res.insertId});
    });
}

Posts.like = (like_uid, result) => {
    let query =  sql.format(`UPDATE ?? SET isLiked_fld = 1 WHERE like_uid = ?`,     
    [
        'likes_tbl', 
        like_uid
    ]);
    sql.query(query, (err, res) => {        
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }        
        if(res.affectedRows == 1){
            console.log('post already liked: ', {like_uid: res.insertId});
            result(null, {message:'post already liked',like_uid: res.insertId});
            return;
        }

        console.log('like post: ', {like_uid: res.insertId});
        result(null, {like_uid: res.insertId});
    });
}

// increase and count total likes
Posts.postLike = (post_uid, result) => {
    let query = sql.format("UPDATE ?? SET total_likes_fld = total_likes_fld + 1 WHERE post_uid = ?", 
    [
        'posts_tbl',
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

        console.log('update liked post: ', {post_uid: post_uid});
        result(null, {post_uid: post_uid})
    });
}

// decrease and count total likes
Posts.postDislike = (post_uid, result) => {
    let query = sql.format("UPDATE ?? SET total_likes_fld = total_likes_fld - 1 WHERE post_uid = ?", 
    [
        'posts_tbl',
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

        console.log('update disliked post: ', {post_uid: post_uid});
        result(null, {post_uid: post_uid})
    });
}

// Get all post likes 
Posts.getAllPostLikes = (result) => {
    let query =  sql.format('SELECT * FROM ?? ORDER BY date_created_TS_fld DESC', ['likes_tbl']);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err,null);
            return;
        }

        console.log('All liked posts: ', res);
        result(null, res);
    });
};

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

// Get Highest trends
Posts.maxLikes = (result) => {
    let query =  sql.format(`SELECT posts_tbl.post_uid , posts_tbl.content_fld, posts_tbl.date_created_TS_fld, COUNT(posts_tbl.post_uid) AS total_likes FROM ?? JOIN ?? WHERE posts_tbl.post_uid = likes_tbl.post_uid AND posts_tbl.is_deleted_fld = 0 AND likes_tbl.isLiked_fld = 1 GROUP BY posts_tbl.post_uid ORDER BY total_likes DESC LIMIT 5`,
     ['posts_tbl','likes_tbl']);
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

// upload img
Posts.updateFile = (post_uid, post, result) => {
    let query = sql.format("UPDATE ?? INNER JOIN ?? USING (studid_fld) SET posts_tbl.img_fld = ? WHERE posts_tbl.post_uid = ?", ['posts_tbl', 'students_tbl', post.img_fld, post_uid]);
    sql.query(query,
      (err, res) => {
        if (err) {
          console.log("ERROR: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("upload img: ", { post_uid: post_uid, ...post });
        result(null, { message: "upload img", post_uid: post_uid, ...post }, );
      } 
    );
  };

//dashboard - total number of new post per mounth
  Posts.getNumPostsCCS = (result) => {
    let query = sql.format(
      `SELECT posts_tbl.date_created_TS_fld AS date_posted, COUNT(post_uid) AS num_posts, students_tbl.dept_fld FROM ?? INNER JOIN ?? USING (studid_fld) WHERE is_deleted_fld = 0 AND students_tbl.dept_fld = "CCS" GROUP BY DATE(date_created_TS_fld) ORDER BY date_posted`,
      ["posts_tbl", "students_tbl"]
    );
    sql.query(query, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        result(null, res);
        return;
      }
  
      result({ kind: "not_found" }, null);
    });
  };

module.exports = Posts; 