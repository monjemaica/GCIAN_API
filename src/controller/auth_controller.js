const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const moment = require('moment');
const Account = require('../model/auth_model'); 

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

exports.login = (req, res) => {
    
    if(!req.body){
        res.status(400).send({message: 'Invalid Email or Password'});
    };

    Account.getEmailById(req.body.email_fld, (err, data) => {
        if(err){
            res.status(500).send({message: 'Errors found while login'});
        }

        if(!data){
            res.status(400).send({message: 'No data received'});
        }
        console.log('test: ', data);
         
        const result = compareSync(req.body.password_fld, data.password_fld);
        if(result){
            data.password = undefined;
            const jsontoken = sign({result: data}, "secret_K3Y", {
                expiresIn: '2h'
            });
            return res.send({message: "Login successfully", token: jsontoken}); 
            
        }
         res.status(400).send({message:  'Invalid Email or Password'});
    });
   
};
