const sql = require('./db_model.js');

// Create Account 
const Account = function(account){
    this.recno_uid = account.recno_uid, 
    this.studid_fld = account.studid_fld,
    this.email_fld = account.email_fld,
    this.password_fld = account.password_fld
    this.last_login_TS_fld = account.last_login_TS_fld,
    this.date_created_TS_fld = account.date_created_TS_fld,
    this.is_deleted_fld = account.is_deleted_fld
}

Account.create =(newAccount, result) => {

    sql.query('INSERT INTO accounts_tbl SET ?', newAccount, (err, res) => { 
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        console.log('new account: ', {recno_uid: res.insertId, ...newAccount});
        result(null, {recno_uid: res.insertId, ...newAccount});
    });
 
};

Account.getEmailById = (email_fld, result) => {
    
    sql.query('SELECT * FROM accounts_tbl WHERE email_fld = ?', [email_fld], (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        return result(null, res[0]);
        
    });
}

module.exports = Account;