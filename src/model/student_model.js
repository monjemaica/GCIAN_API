const sql = require('./db_model');



// Create Student
const Student = function(student){
    this.recno_uid = student.recno_uid,
    this.studid_fld = student.studid_fld,
    this.fname_fld = student.fname_fld,
    this.mname_fld = student.mname_fld,
    this.lname_fld = student.lname_fld,
    this.extname_fld = student.extname_fld,
    this.dept_fld = student.dept_fld,
    this.program_fld = student.program_fld
}

// Create new customer
Student.create = (newStudent, result) => {

    sql.query('INSERT INTO students_tbl SET ?', newStudent, (err, res) => {
        if(err){
            console.log('Error: ',err)
            result(err, null);
            return;
        }

        console.log("new student: ", {studid_fld: res.insertId, ...newStudent});
        result(null, {recno_uid: res.insertId, ...newStudent});
    });

};

// Retrieve a Student with id
Student.findById = (studid_fld, result) => {
    
    sql.query(`SELECT * FROM students_tbl WHERE studid_fld = ${studid_fld}`, (err, res) => {
        if(err){
            console.log('ERROR: ',err)
            result(err, null);
            return;
        }

        if(res.length){
            console.log('student: ', res);
            result(null, res[0]);
            return;
        }

        result({kind: 'not_found'}, null);
    });

};


// Get all students
Student.getAll = result => {

    sql.query('SELECT * FROM students_tbl INNER JOIN accounts_tbl USING (studid_fld) WHERE is_deleted_fld = 0', (err, res) => {
        if(err){
            console.log('ERROR: ', err);
            result(err, null);
            return;
        }

        console.log('students: ', res);
        result(null, res);
    });

};

// Update a student with id
Student.updateById = (studid_fld, student, result) => {

    sql.query('UPDATE students_tbl SET fname_fld = ?, mname_fld = ?, lname_fld = ?, extname_fld =?, dept_fld = ?, program_fld = ? WHERE studid_fld = ?',
    [student.fname_fld, student.mname_fld, student.lname_fld, student.extname_fld, student.dept_fld, student.program_fld, studid_fld],
    (err, res) => {
        
        if(err){
            console.log('ERROR: ', err);
            result(null, err);
            return;
        }
        
        // Checking changes
        if(res.affectedRows == 0){
            result({kind: "not_found"}, null);
            return;
        }

        console.log('updated student: ', {studid_fld: studid_fld, ...student});
        result(null, {studid_fld: studid_fld, ...student});
    });
};

// Delete student with customerId
Student.removeById  = (studid_fld, student, result) => {

    sql.query('UPDATE accounts_tbl SET is_deleted_fld = 1 WHERE studid_fld = ?',
    [studid_fld],
    // sql.query('UPDATE student_tbl SET ?, WHERE studid_fld = ?',
    // [student, studid_fld], 
    (err, res) => {
        
        if(err){
            console.log('ERROR: ', err);
            result(null, err);
            return;
        }

        if(res.affectedRows == 0){
            result({kind: "not_found"}, null);
            return;
        }

        console.log('updated student: ', {studid_fld: studid_fld, ...student})
        result(null, {message: 'Record Deleted'});
    });

};

module.exports = Student;