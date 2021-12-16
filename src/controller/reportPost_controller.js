const Reports = require("../model/reportPost_model");
const moment = require('moment');

exports.create = (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'No data received'});
    }

    const report = new Reports({
        post_uid : req.params.post_uid,
        studid_fld: req.body.studid_fld,
        concern_fld: req.body.concern_fld,
        content_fld : req.body.content_fld,
        isViewed_fld: 0,
        date_created_at_fld : moment().format()
    });
    
    Reports.newReport(report, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Errors found while create new report'
            });
        }
        res.send(data);
    });
    
};