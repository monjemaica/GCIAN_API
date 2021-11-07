module.exports = app => {

    const students = require('../controller/student_controller')
    
    
    app.post('/students/create', students.create);
    
    app.get('/students', students.findAll);
    app.get('/students/:studid_fld', students.findOne);

    app.put('/students/:studid_fld', students.update);

    app.delete('/students/:studid_fld', students.delete);
}