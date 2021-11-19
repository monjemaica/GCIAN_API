const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const moment = require('moment');
const Account = require('../model/auth_model'); 
const Student = require('../model/student_model')

exports.create = (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'No data received'});
    }
    // Create account for student
    const salt = genSaltSync(10);
    const account = new Account({
        recno_uid: req.body.recno_fld,
        studid_fld : req.body.studid_fld,
        email_fld : req.body.email_fld,
        password_fld : hashSync(req.body.password_fld, salt),
        last_login_TS_fld : req.body.last_login_TS_fld,
        date_created_TS_fld : moment().format(),
        is_deleted_fld : 0  
    })

    Account.create(account, (err, data) => {
        if(err){
            res.status(500).send({message: err.message || 'Errors found while create new account for student'});
        }
        res.send(data);
    })
} 

// exports.login = (req, res) => {
    
//     if(!req.body){
//         res.status(400).send({message: 'Invalid Email or Password'});
//     };

//     Student.findById({
//         where: {
//             email_fld: req.body.email_fld
//         }
//     }).then(student => {
//         if(!student) {
//             return res.status(404).send({message:'Student Not found'});
//         }

//         let passwordIsValid = bcrypt.compareSync(
//             req.body.password_fld,
//             student.password_fld
//         );

//         if(!passwordIsValid) {
//             return res.status(401).send({
//                 accessToken: null,
//                 message: "Invalid Password!"
//             })
//         }

//         const authorities = [];
//         res.status(200).send({
//             recno_uid: student.recno_uid,
//             studid_fld: student.studid_fld,
//             fname_fld: student.fname_fld,
//             mname_fld: student.mname_fld,
//             lname_fld: student.lname_fld,
//             extname_fld: student.extname_fld,
//             dept_fld: student.dept_fld,
//             program_fld: student.program_fld,
//             avatar_fld: student.avatar_fld
//         })
//     }).catch((err) => {
//         res.status(500).send({message: err.message});
//     })

exports.login = (req, res) => {
    Account.getEmailById(req.body.email_fld, (err, data) => {
        if(err){
            res.status(500).send({message: 'Errors found while login'});
        }

        if(!data){
            res.status(400).send({message: 'No data received'});
        }
        console.log('user_login: ', data);
         
        const result = compareSync(req.body.password_fld, data.password_fld);
        if(result){
            data.password = undefined;
            const jsontoken = sign({result: data}, "secret_K3Y", {
                expiresIn: '2h'
            });
            return res.send({message: "Login successfully", token: jsontoken, data:data}); 
            
        }
         res.status(400).send({message:  'Invalid Email or Password'});
    }); 
}; 
 