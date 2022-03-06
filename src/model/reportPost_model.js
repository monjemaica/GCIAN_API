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

    //post table
    this.post_uid = reports.post_uid;
    this.is_reported_fld = reports.is_reported_fld;
};

// Create new report for post
Reports.newReport = (report, result) => {
  let query = sql.format("INSERT INTO ?? SET post_uid = ?, studid_fld = ?, concern_fld = ?, content_fld = ?, isViewed_fld = 0, date_created_at_fld = ?", ['reports_tbl', report.post_uid, report.studid_fld, report.concern_fld, report.content_fld, report.date_created_at_fld]);
  sql.query(query, (err, res) => {
    if (err) {
      result (err, null);
      return;
    }

    console.log("new report: ", { report_uid: res.insertId, ...report });
    result(null, { report_uid: res.insertId, ...report });
  });
};

Reports.updatePostReport = (post_uid, result) => {
  let query = sql.format('UPDATE ?? SET is_reported_fld = 1 WHERE post_uid = ?',
  [
      'posts_tbl',
      post_uid
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

      console.log('update report: ', {post_uid: post_uid});
      result(null, {post_uid: post_uid});
  });
};

 
// Get all reports in post
Reports.getAll = (result) => {
  let query =  sql.format("SELECT posts_tbl.post_uid, reports_tbl.report_uid, students_tbl.fname_fld, students_tbl.mname_fld, students_tbl.lname_fld, posts_tbl.content_fld AS post_content, posts_tbl.studid_fld AS author, reports_tbl.content_fld AS report_content, reports_tbl.concern_fld, reports_tbl.studid_fld AS reported_by, posts_tbl.date_created_TS_fld AS date_created, reports_tbl.date_created_at_fld AS date_reported, reports_tbl.isViewed_fld FROM ?? JOIN ?? JOIN students_tbl ON students_tbl.studid_fld = reports_tbl.studid_fld WHERE reports_tbl.post_uid = posts_tbl.post_uid ORDER BY date_created_TS_fld DESC", ['reports_tbl','posts_tbl']);
  sql.query(query, (err, res) => {
    if (err) {
      result (err, null); 
      return;
    }

      if(res.length){
        console.log('reports: ', res);
        result(null, res);
        return;
    }
  });
};

// Get all reports in post
Reports.getNoticeReport = (result) => {
  let query =  sql.format("SELECT posts_tbl.post_uid, reports_tbl.report_uid, students_tbl.fname_fld, students_tbl.mname_fld, students_tbl.lname_fld, posts_tbl.content_fld AS post_content, posts_tbl.studid_fld AS author, reports_tbl.content_fld AS report_content, reports_tbl.concern_fld, reports_tbl.studid_fld AS reported_by, posts_tbl.date_created_TS_fld AS date_created, reports_tbl.date_created_at_fld AS date_reported, reports_tbl.isViewed_fld FROM ?? JOIN ?? JOIN students_tbl ON students_tbl.studid_fld = reports_tbl.studid_fld WHERE reports_tbl.post_uid = posts_tbl.post_uid AND isViewed_fld = 1 ORDER BY date_created_TS_fld DESC", 
  ['reports_tbl','posts_tbl']
  );
  sql.query(query, (err, res) => {
    if (err) {
      result (err, null); 
      return;
    }

      if(res.length){
        console.log('reports: ', res);
        result(null, res);
        return;
    }
  });
};
Reports.getIgnoredReport = (result) => {
  let query =  sql.format("SELECT posts_tbl.post_uid, reports_tbl.report_uid, students_tbl.fname_fld, students_tbl.mname_fld, students_tbl.lname_fld, posts_tbl.content_fld AS post_content, posts_tbl.studid_fld AS author, reports_tbl.content_fld AS report_content, reports_tbl.concern_fld, reports_tbl.studid_fld AS reported_by, posts_tbl.date_created_TS_fld AS date_created, reports_tbl.date_created_at_fld AS date_reported, reports_tbl.isViewed_fld FROM ?? JOIN ?? JOIN students_tbl ON students_tbl.studid_fld = reports_tbl.studid_fld WHERE reports_tbl.post_uid = posts_tbl.post_uid AND isViewed_fld = 0 ORDER BY date_created_TS_fld DESC", 
  ['reports_tbl','posts_tbl']
  );
  sql.query(query, (err, res) => {
    if (err) {
      result (err, null); 
      return;
    }

      if(res.length){
        console.log('reports: ', res);
        result(null, res);
        return;
    }
  });
};

// Count reports
Reports.countReports = (result) => {
  let query =  sql.format("SELECT COUNT(posts_tbl.post_uid) AS total_reports FROM ?? JOIN ?? JOIN students_tbl ON students_tbl.studid_fld = reports_tbl.studid_fld WHERE reports_tbl.post_uid = posts_tbl.post_uid ORDER BY date_created_TS_fld DESC", ['reports_tbl','posts_tbl']);
  sql.query(query, (err, res) => {
    if (err) {
      result (err, null); 
      return;
    }

      if(res.length){
        console.log('total_report: ', res[0]);
        result(null, res[0]);
        return;
    }
  });
};

// Update report by Id
Reports.updateById = (report_uid, result) => {
  let query = sql.format('UPDATE ?? SET isViewed_fld = 1 WHERE report_uid = ?',
  [
      'reports_tbl',
      report_uid
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

      console.log('update report: ', {report_uid: report_uid});
      result(null, {report_uid: report_uid});
  });
};

Reports.updateNoticed = (report_uid, result) => {
  let query = sql.format('UPDATE ?? SET isViewed_fld = 0 WHERE report_uid = ?',
  [
      'reports_tbl',
      report_uid
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

      console.log('update report: ', {report_uid: report_uid});
      result(null, {report_uid: report_uid});
  });
};



module.exports = Reports;