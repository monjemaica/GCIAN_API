const { hashSync, genSaltSync } = require("bcrypt");
const Students = require("../model/student_model");
const moment = require('moment');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "No data received" });
  }

  // Create student

  const student = new Students({
    recno_uid: req.body.recno_uid,
    studid_fld: req.body.studid_fld,
    fname_fld: req.body.fname_fld,
    mname_fld: req.body.mname_fld,
    lname_fld: req.body.lname_fld,
    extname_fld: req.body.extname_fld,
    dept_fld: req.body.dept_fld,
    program_fld: req.body.program_fld,
    avatar_fld: req.body.avatar_fld
  });

  // Save students in the database
  Students.create(student, (err, data) => {
    if (err) {
      res.status(500).send({
          message: err.message || "Errors found while create new student",
        });
    }
    res.send(data);
  });
};

exports.findAll = (req, res) => {
  Students.getAll((err, data) => {
    if (err) {
      res.status(500).send({
          message: err.message || "Errors found while retrieving students",
        });
    }
    res.send(data);
  });
};

exports.findOne = (req, res) => {
  Students.findById(req.params.studid_fld, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ 
          message: `Record not found: ${req.params.studid_fld}`,
        });
      }
      res.status(500).send({ message: err.message || `Errors found while retrieving students by id:${req.params.studid_fld}` });
    }
    res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Not data received" });
  }

  const salt = genSaltSync(10);
  const student = new Students({
    recno_uid: req.body.recno_uid,
    studid_fld: req.body.studid_fld,
    fname_fld: req.body.fname_fld,
    mname_fld: req.body.mname_fld,
    lname_fld: req.body.lname_fld,
    extname_fld: req.body.extname_fld,
    dept_fld: req.body.dept_fld,
    program_fld: req.body.program_fld,
    password_fld: hashSync(req.body.password_fld, salt),
  });

  Students.updateById(req.params.studid_fld, student, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Record not found: ${req.params.studid_fld}` });
      }
      res.status(500).send({
          message:
            err.message ||
            `Error updating student with studid_fld ${req.params.studid_fld}`,
        });
    }

    res.send(data);
  });
};

exports.delete = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Not data received" });
  }

  const student = new Students({
    recno_uid: req.body.recno_uid,
    studid_fld: req.body.studid_fld,
    deleted_At_fld: moment().format()
  });
  
  Students.removeById(req.params.studid_fld, student, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Record not found: ${req.params.studid_fld}` });
      }
      res.status(500).send({
          message:
            err.message ||
            `Could not delete student with studid_fld ${req.params.studnum}`,
        });
    } 
    res.send({ message: `Student was deleted successfully`, data: data });
  });
};
