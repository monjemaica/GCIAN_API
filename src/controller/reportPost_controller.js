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
        

        Reports.updatePostReport(req.params.post_uid, (err, data) => {
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



    });
    
};


exports.findNoticed = (req, res) => {
    Reports.getNoticeReport((err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.send([])  
             }
            res.status(500).send({
                message: err.message || "Errors found while retrieving all reports"
            });
        }
        return res.send(data);
    });
}

exports.findIgnored = (req, res) => {
    Reports.getIgnoredReport((err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.send([])  
             }
            res.status(500).send({
                message: err.message || "Errors found while retrieving all reports"
            });
        }
        return res.send(data);
    });
}

exports.findAll = (req, res) => {
    Reports.getAll((err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.send([])  
             }
            res.status(500).send({
                message: err.message || "Errors found while retrieving all reports"
            });
        }
        return res.send(data);
    });
}


exports.getTotalReports = (req, res) => {
    Reports.countReports((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Errors found while retrieving all reports"
            });
        }
        return res.send(data);
    });
} 

// Update report by Id
exports.update = (req, res) => {


    Reports.updateById(req.params.report_uid, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({message: `Record not found: ${req.params.report_uid}`});
            }
            res.status(500).send({
                message: err.message || `Error updating post with post_uid ${req.params.report_uid}`,
            });
        }
        res.send(data);
    });
};
exports.updateNoticedId = (req, res) => {


    Reports.updateNoticed(req.params.report_uid, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({message: `Record not found: ${req.params.report_uid}`});
            }
            res.status(500).send({
                message: err.message || `Error updating post with post_uid ${req.params.report_uid}`,
            });
        }
        res.send(data);
    });
};