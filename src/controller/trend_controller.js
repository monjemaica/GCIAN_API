const Trends = require('../model/trend_model');
const moment = require('moment');

exports.create = (req, res) => {
    
    if(!req.body){
        res.status(400).send({message: 'No data received'});
    }

    const trend = new Trends({
        content_fld: req.body.content_fld,
        is_created_at_fld : moment().format()
    });
    
    Trends.create(trend, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Errors found while adding trend keyword'
            });
        }
        console.log('data', data)
         res.send(data);   
    });
    
}

exports.createRelation = (req, res) => {
    
    if(!req.body){
        res.status(400).send({message: 'No data received'});
    }

    const trend = new Trends({
        hashtag_uid: req.body.hashtag_uid,
        post_uid: req.body.post_uid
    });
    
    Trends.createRelation(trend, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Errors found while adding trend keyword'
            });
        }
        console.log('data', data)
        res.send(data);   
    }); 
}

exports.getTotalTrends = (req, res) => {
    Trends.count((err, data) => {
        if(err){
            res.sendStatus(500).send({
                message: err.message || "Errors found while retrieving total_trends"
            });
        }
        res.send(data);
    });
} 
exports.getAllTrends = (req, res) => {
    Trends.getAll((err, data) => {
        if(err){
            res.sendStatus(500).send({
                message: err.message || "Errors found while retrieving total_trends"
            });
        }
        res.send(data);
    });
} 