const sql = require('./db_model.js');

// Create Account 
const Account = function(account){
    this.recno_uid = account.recno_uid, 
    this.studid_fld = account.studid_fld,
    this.email_fld = account.email_fld,
    this.password_fld = account.password_fld
    this.last_login_TS_fld = account.last_login_TS_fld,
    this.date_created_TS_fld = account.date_created_TS_fld,
    this.updated_At_fld = account.updated_At_fld,
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
    
    sql.query(`SELECT * FROM students_tbl INNER JOIN accounts_tbl USING (studid_fld) WHERE email_fld = '${email_fld}'`, 
    (err, res) => {
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }
        console.log(res[0]);
        return result(null, res[0]);
        
    });
}

Account.getOldPassById = (studid_fld, account, result) => {
    sql.query('SELECT * FROM accounts_tbl WHERE studid_fld = ? AND is_deleted_fld = 0', studid_fld,
    (err,res)=>{
        if(err){
            console.log('Invalid Old Password: ', err)
            return;
        }
        if(res.length){
            sql.query('UPDATE accounts_tbl SET password_fld = ? WHERE studid_fld = ?', [account.password_fld, studid_fld],
            (err,res) => {
                if(err){
                    console.log('Error: ', err);
                    result('Error: ', err)
                    return
                }
                if(res.affectedRows == 0) {
                    console.log('No changes');
                    result('No changes')
                    return;
                }
        
                console.log('update password: ', {studid_fld: studid_fld, ...account});
                
            });

            console.log('account: ', res[0]);
            result('update pass: ',res[0]);
            return;
        }
        return result('account: ',res[0]);
    });
}

module.exports = Account;