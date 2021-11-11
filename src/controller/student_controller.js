const { hashSync, genSaltSync } = require('bcrypt');
const Student = require('../model/student_model');

exports.findAll = (req, res) => {
    
    Student.getAll( (err, data) => {
        if(err){
            res.status(500).send({message: err.message || 'Errors found while retrieving students'});
        }
        res.send(data);
    });

};

exports.create = (req, res) => {

    if(!req.body){
        res.status(400).send({message: 'No data received'});
    }

    // Create student

    const student = new Student({
        recno_uid : req.body.recno_uid,
        studid_fld : req.body.studid_fld,
        fname_fld : req.body.fname_fld,
        mname_fld : req.body.mname_fld,
        lname_fld : req.body.lname_fld,
        extname_fld : req.body.extname_fld,
        dept_fld : req.body.dept_fld,
        program_fld : req.body.program_fld
    });

    // Save students in the database
    Student.create(student, (err, data) => {
        if(err){
            res.status(500).send({message: err.message || 'Errors found while create new student'})
        }
        res.send(data);
    });

};

exports.findOne = (req, res) => {

    Student.findById(req.params.studid_fld, (err, data) => {
        if(err){
            if(err.kind === 'not_found'){
                res.status(404).send({
                    message: `Record not found: ${req.params.studid_fld}`
                });
            }
            res.status(500).send({message: err.message || 'Errors found while '})
        }
        res.send(data);
    });

};

exports.update = (req, res) => {

    if(!req.body){
        res.status(400).send({message: 'Not data received'});
    }
    
    const salt = genSaltSync(10);
    const student = new Student({
        recno_uid : req.body.recno_uid,
        studid_fld : req.body.studid_fld,
        fname_fld : req.body.fname_fld,
        mname_fld : req.body.mname_fld,
        lname_fld : req.body.lname_fld,
        extname_fld : req.body.extname_fld,
        dept_fld : req.body.dept_fld,
        program_fld : req.body.program_fld,
        password_fld : hashSync(req.body.password_fld, salt)
    });


    Student.updateById(req.params.studid_fld, student, (err, data) => {
        if(err){
            if(err.kind === 'not_found'){
                res.status(404).send({message: `Record not found: ${req.params.studid_fld}`});
            }
            res.status(500).send({message: err.message || `Error updating Customer with studid_fld ${req.params.studid_fld}`});
        }

        res.send(data);
    });

};

exports.delete = (req, res) => {

    if(!req.body){
        res.status(400).send({message: 'Not data received'});
    }

    const student = new Student({
        fname_fld : req.body.fname_fld,
        mname_fld : req.body.mname_fld,
        lname_fld : req.body.lname_fld,
        extname_fld : req.body.extname_fld,
        dept_fld : req.body.dept_fld,
        program_fld : req.body.program_fld,
        password_fld : hashSync(req.body.password_fld, salt)
    });

    Student.removeById(req.params.studid_fld, student, (err, data) => {
        if(err){
            if(err.kind === 'not_found'){
                res.status(404).send({message: `Record not found: ${req.params.studid_fld}`});
            }
            res.status(500).send({message: err.message || `Could not delete student with studid_fld ${req.params.studnum}` });
        }
        res.send({ message: `Customer was deleted successfully`});
    });
   
};