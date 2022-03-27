const Student = require('../model/student_model');


function setUser(req, res, next){
    const account = Student.getAll()
    const userId = req.body.studid_fld;
    console.log("userid", account);
    if(userId){
        req.user = account.find(user => user.studid_fld === userId);
    }
    next();
}

module.exports = {setUser}