const sql = require("./db_model");

// Create Student
const Reports = function (reports) {
    this.report_uid = reports.report_uid,
    this.post_uid = reports.post_uid,
    this.studid_fld = reports.studid_fld,
    this.concern_fld = reports.concern_fld,
    this.content_fld = reports.content_fld,
    this.isViewed_fld= reports.isViewed_fld,
    this.date_created_at_fld = reports.date_created_at_fld
};

// Create new student
Reports.newReport = (report, result) => {
  let query = sql.format("INSERT INTO ?? SET post_uid = ?, studid_fld = ?, concern_fld = ?, content_fld = ?, isViewed_fld = 0, date_created_at_fld = ?", ['reports_tbl', report.post_uid, report.studid_fld, report.concern_fld, report.content_fld, report.date_created_at_fld]);
  sql.query(query, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    console.log("new report: ", { report_uid: res.insertId, ...report });
    result(null, { report_uid: res.insertId, ...report });
  });
};

module.exports = Reports;