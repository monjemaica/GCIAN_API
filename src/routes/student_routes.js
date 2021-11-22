module.exports = app => {

    const students = require('../controller/student_controller');
    const accounts = require('../controller/auth_controller');
    const posts = require('../controller/post_controller');
    const comments = require('../controller/comment_controller');

    const {auth} = require('../../src/services/token_validation');

    app.post('/students/create', auth, students.create);
    
    app.get('/students',auth, students.findAll);
    app.get('/students/:studid_fld', students.findOne);

    app.put('/students/:studid_fld', auth, students.update);

    app.delete('/students/:studid_fld', auth, students.delete);

    // ACCOUNT ROUTES
    app.post('/students/register', accounts.create);
    app.post('/students/login', accounts.login);
    
    // POST ROUTES   
    app.get('/posts/:studid_fld', posts.findPostByStudid);  
    app.get('/post/:post_uid', posts.findPostById);  
    app.get('/posts', posts.findAll);  
    app.post('/posts/compose', posts.compose);       
    app.put('/posts/:post_uid', posts.update);
    app.delete('/posts/:post_uid', posts.delete);

    //COMMENT ROUTES 
    app.post('/posts/:post_uid/comments', comments.create);
    app.get('/posts/:post_uid/comments', comments.findAll);
    app.put('/comment/:comment_uid', comments.updateById);
    app.delete('/comment/:comment_uid', comments.delete); 
}  