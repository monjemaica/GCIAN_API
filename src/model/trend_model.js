const sql = require('./db_model.js');

// Create Constructor
const Trends = function(trends){
   this.hashtag_uid = trends.hashtag_uid,
   this.content_fld = trends.content_fld,
   this.is_created_at_fld = trends.is_created_at_fld,

   //hashtags_relations_tbl
   this.post_uid =  trends.post_uid
    
}

// Add trend
Trends.create = (trend, result) => {
    let query =  sql.format('INSERT INTO ?? SET content_fld = ? , is_created_at_fld = ?', ['hashtags_tbl', trend.content_fld, trend.is_created_at_fld]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }
        
        console.log('added trend keyword: ', {hashtag_uid: res.insertId}); 
        result(null, {hashtag_uid: res.insertId});
    });
}; 

Trends.createRelation = (trend, result) => {
    let query = sql.format('INSERT INTO ?? SET hashtag_uid = ?, post_uid = ?', ['hashtag_relations_tbl', trend.hashtag_uid, trend.post_uid]);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        console.log('added trends relation: ', {hashtag_uid: res.insertId, ...trend})
        result(null, {hashtag_uid: res.insertId, ...trend});
    });
};

Trends.count = (result) => {
    let query =  sql.format("SELECT hashtags_tbl.content_fld, COUNT(hashtag_relations_tbl.hashtag_uid) AS total_trends, hashtags_tbl.is_created_at_fld FROM ?? JOIN ?? WHERE hashtags_tbl.hashtag_uid = hashtag_relations_tbl.hashtag_uid GROUP BY hashtags_tbl.content_fld ORDER BY hashtags_tbl.is_created_at_fld DESC LIMIT 7",   
    ['hashtag_relations_tbl','hashtags_tbl']);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        console.log('count trends: ', res);
        result(null, res);
    });
};

Trends.getAll = (result) => {
    let query =  sql.format("SELECT * FROM ??", 
    ['hashtags_tbl']);
    sql.query(query, (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        console.log('count trends: ', res);
        result(null, res);
    });
};


module.exports = Trends;