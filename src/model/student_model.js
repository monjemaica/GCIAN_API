const sql = require("./db_model");

// Create Student
const Students = function (student) {
  (this.studid_fld = student.studid_fld),
    (this.fname_fld = student.fname_fld),
    (this.mname_fld = student.mname_fld),
    (this.lname_fld = student.lname_fld),
    (this.extname_fld = student.extname_fld),
    (this.dept_fld = student.dept_fld),
    (this.program_fld = student.program_fld),
    (this.avatar_fld = student.avatar_fld),
    (this.password_fld = student.password_fld),
    (this.deleted_At_fld = student.deleted_At_fld);
  this.last_login_TS_fld = student.last_login_TS_fld;
};

// Create new student
Students.create = (newStudent, result) => {
  let query = sql.format("INSERT INTO ?? SET ?", ["students_tbl", newStudent]);
  sql.query(query, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    console.log("new student: ", { studid_fld: res.insertId, ...newStudent });
    result(null, { recno_uid: res.insertId, ...newStudent });
  });
};

// Get all students
Students.getAll = (result) => {
  let query = sql.format(
    "SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE is_deleted_fld = 0",
    ["students_tbl", "accounts_tbl"]
  );
  sql.query(query, (err, res) => {
    if (err) {
      console.log("ERROR: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    console.log("students: ", res);
    result({ kind: "not_found" }, null);
  });
};

// Count users
Students.countUsers = (result) => {
  let query = sql.format(
    "SELECT COUNT(students_tbl.studid_fld) AS total_users  FROM ?? INNER JOIN ?? USING (studid_fld) WHERE is_deleted_fld = 0",
    ["students_tbl", "accounts_tbl"]
  );
  sql.query(query, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }
    console.log("posts: ", res[0]);
    result(null, res[0]);
  });
};

// Retrieve a Student with id
Students.findById = (studid_fld, result) => {
  let query = sql.format(
    `SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE studid_fld = ?`,
    ["students_tbl", "accounts_tbl", studid_fld]
  );
  sql.query(query, (err, res) => {
    if (err) {
      console.log("ERROR: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("student: ", res);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

// Update a student with id
Students.updateById = (studid_fld, student, result) => {
  let query = sql.format(
    "UPDATE ?? INNER JOIN ?? USING (studid_fld) SET fname_fld = ?, mname_fld = ?, lname_fld = ?, extname_fld =?, dept_fld = ?, program_fld = ?, password_fld = ? WHERE studid_fld = ?",
    [
      "students_tbl",
      "accounts_tbl",
      student.fname_fld,
      student.mname_fld,
      student.lname_fld,
      student.extname_fld,
      student.dept_fld,
      student.program_fld,
      student.password_fld,
      studid_fld,
    ]
  );
  sql.query(query, (err, res) => {
    if (err) {
      console.log("ERROR: ", err);
      result(null, err);
      return;
    }

    // Checking changes
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated student: ", { studid_fld: studid_fld, ...student });
    result(null, { studid_fld: studid_fld, ...student });
  });
};

// Delete student with id
Students.removeById = (studid_fld, student, result) => {
  let query = sql.format(
    "UPDATE ?? INNER JOIN ?? USING (studid_fld) SET deleted_At_fld = ?, is_deleted_fld = 1 WHERE studid_fld = ?",
    ["students_tbl", "accounts_tbl", student.deleted_At_fld, studid_fld]
  );
  sql.query(query, (err, res) => {
    if (err) {
      console.log("ERROR: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated student: ", { studid_fld: studid_fld, ...student });
    result(null, {
      message: "Record Deleted",
      studid_fld: studid_fld,
      ...student,
    });
  });
};

Students.updateFile = (studid_fld, student, result) => {
  let query = sql.format(
    "UPDATE ?? INNER JOIN ?? USING (studid_fld) SET avatar_fld = ? WHERE studid_fld = ?",
    ["students_tbl", "accounts_tbl", student.avatar_fld, studid_fld]
  );
  sql.query(query, (err, res) => {
    if (err) {
      console.log("ERROR: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated avatar: ", { studid_fld: studid_fld, ...student });
    result(null, {
      message: "Updated avatar",
      studid_fld: studid_fld,
      ...student,
    });
  });
};

Students.updateLastLogin = (studid_fld, student, result) => {
  let query = sql.format(
    "UPDATE ?? INNER JOIN ?? USING (studid_fld) SET last_login_TS_fld = ? WHERE studid_fld = ?",
    ["students_tbl", "accounts_tbl", student.last_login_TS_fld, studid_fld]
  );
  sql.query(query, (err, res) => {
    if (err) {
      console.log("ERROR: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("User Logout: ", { studid_fld: studid_fld });
    result(null, { message: "User Logout", studid_fld: studid_fld });
  });
};

module.exports = Students;
