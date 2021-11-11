module.exports = app => {

    const students = require('../controller/student_controller');
    const accounts = require('../controller/auth_controller');
    const {auth} = require('../../src/services/token_validation');
    
    app.post('/students/create', auth, students.create);
    
    app.get('/students', auth, students.findAll);
    app.get('/students/:studid_fld', auth, students.findOne);

    app.put('/students/:studid_fld', auth, students.update);

    app.delete('/students/:studid_fld', auth, students.delete);

    // ACCOUNT ROUTES
    app.post('/students/register', accounts.create);
    app.post('/students/login', accounts.login);
} 