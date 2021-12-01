const sql = require('./db_model.js');
const Student = require('./student_model');
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

//create Student

Account.create =(newAccount, result) => {
    let query = sql.format('INSERT INTO ?? SET ?', ['accounts_tbl', newAccount]);
    sql.query(query, (err, res) => { 
        if(err){
            console.log('Error: ', err);
            result(err, null);
            return;
        }

        console.log('new account: ', {recno_uid: res.insertId, ...newAccount});
        result(null, {recno_uid: res.insertId, ...newAccount});

        if(res.serverStatus == 2){
            Student.create = (newStudent, result) => {
                let query = sql.format('INSERT INTO ?? SET ?', ['students_tbl', newStudent]);
                sql.query(query, (err, res) => {
                    if(err){
                        console.log('Error: ', err);
                        result(err,null);
                        return;
                    }
                    console.log('new student: ', {recno_uid: res.insertId, ...newStudent});
                    result(null, {recno_uid: res.insertId, ...newStudent}); 
                })
            }
        }
       
    });
 
};

Account.getEmailById = (email_fld, result) => {
    let query = sql.format('SELECT * FROM ?? INNER JOIN ?? USING (studid_fld) WHERE email_fld = ?', ['students_tbl', 'accounts_tbl', email_fld]);
    sql.query(query, 
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

// Account.getEmailById = (email_fld, result) => {
    
//     sql.query('SELECT * FROM accounts_tbl WHERE email_fld = ?', [email_fld], (err, res) => {
//         if(err){
//             console.log('Error: ', err);
//             result(err, null);
//             return;
//         }

//         return result(null, res[0]);
        
//     });
// }

Account.getOldPassById = (studid_fld, account, result) => {
    let query = sql.format('SELECT * FROM ?? WHERE studid_fld = ? AND is_deleted_fld = 0', ['accounts_tbl', studid_fld]);
    sql.query(query,
    (err,res)=>{
        if(err){
            console.log('Invalid Old Password: ', err)
            return;
        }
        if(res.length){
            let query = sql.format('UPDATE ?? SET password_fld = ?, updated_At_fld = ? WHERE studid_fld = ?', ['accounts_tbl', account.password_fld, account.updated_At_fld, studid_fld]);
            sql.query(query,
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