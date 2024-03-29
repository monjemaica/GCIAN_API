const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const moment = require("moment");
const Account = require("../model/auth_model");
const Student = require("../model/student_model");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "No data received" });
  }
  // Create account for student
  const salt = genSaltSync(10);
  const account = new Account({
    recno_uid: req.body.recno_fld,
    studid_fld: req.body.studid_fld,
    email_fld: req.body.email_fld,
    role_fld: req.body.role_fld,
    password_fld: hashSync(req.body.password_fld, salt),
    last_login_TS_fld: req.body.last_login_TS_fld,
    date_created_TS_fld: moment().format(),
    is_deleted_fld: 0,
  });
  const student = new Student(req.body);

  Account.create(account, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Errors found while create new account for student",
      });
    }
    if (data) {
      Student.create(student, (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message ||
              "Errors found while create new account for student",
          });
        }
        res.send(data);
      });
    }
  });
};

exports.login = (req, res) => {
  console.log(req.body);
  if (!req.body) {
    res.status(400).send({ message: "Invalid Email or Password" });
  }

  Account.getEmailById(req.body.email_fld, (err, data) => {
    if (err) {
      res.status(500).send({ message: "Errors found while login" });
    }

    if (!data) {
      res.status(400).send({ message: "No data received" });
    }
    console.log("test: ", data);

    const result = compareSync(req.body.password_fld, data.password_fld);
    if (result) {
      data.password = undefined;
      const jsontoken = sign({ result: data }, "secret_K3Y", {
        expiresIn: "24h",
      });
      return res.send({
        message: "Login successfully",
        token: jsontoken,
        data: data,
      });
    }
    res.status(400).send({ message: "Invalid Email or Password" });
  });
};

exports.checkPassword = (req, res) => {
  Account.getOldPassword(req.params.studid_fld, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Record not found: ${req.params.studid_fld}`,
        });
      }
    }

    if (!data) {
      res.status(400).send({ message: "No data received" });
    }

    console.log("pass:", data[0].password_fld);
    const result = compareSync(req.body.password_fld, data[0].password_fld);
    if (result) {
      data.password = undefined;
      const jsontoken = sign({ result: data }, "secret_K3Y", {
        expiresIn: "2h",
      });
      return res.send({ message: "Password Matched!", data: data });
    }
    res.status(400).send({ message: "Invalid Email or Password" });
  });
};

exports.changePass = (req, res) => {
  const salt = genSaltSync(10);
  const account = new Account({
    password_fld: hashSync(req.body.password_fld, salt),
    last_login_TS_fld: req.body.last_login_TS_fld,
    updated_At_fld: moment().format(),
    is_deleted_fld: 0,
  });

  Account.changePassword(req.params.studid_fld, account, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Record not found: ${req.params.studid_fld}` });
      }
      res.status(500).send({
        message:
          err.message ||
          `Error updating liked post with studid_fld ${req.params.studid_fld}`,
      });
    }
    res.send(data);
  });
};

exports.findNewUsers = (req, res) => {
  Account.setNumUsers((err, data) => {
    Account.getNumNewusers((err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.send([])  
             }
            res.status(500).send({
                message: err.message || "Errors found while retrieving all total new user per month"
            });
        }
        return res.send(data);
    });
  })
}