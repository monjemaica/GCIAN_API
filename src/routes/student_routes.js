module.exports = app => {

    const students = require('../controller/student_controller');
    const accounts = require('../controller/auth_controller');
    const posts = require('../controller/post_controller');
    const comments = require('../controller/comment_controller');
    const reports = require('../controller/reportPost_controller')
    const {auth} = require('../../src/services/token_validation');

    //upload
    const imageUploader = require('../services/image-uploader');

    // STUDENT ROUTES
    app.post('/students/create', auth, students.create);
    app.get('/students',auth, students.findAll);
    app.get('/total_students', auth, students.getTotalUsers);
    app.get('/students/:studid_fld',auth, students.findOne); 
    app.put('/students/:studid_fld', auth, students.update);
    app.post('/logout/:studid_fld', auth, students.lastLogin);
    app.delete('/students/:studid_fld', auth, students.delete);

    // ACCOUNT ROUTES
    app.post('/students/register', accounts.create);
    app.post('/students/login', accounts.login);
    app.post('/students/:studid_fld/check_pass', accounts.checkPassword);
    app.post('/students/:studid_fld/upload', imageUploader.upload.single('avatar_fld'), students.fileUpload);
    
    // POST ROUTES    
    app.get('/posts/:studid_fld', auth, posts.findPostByStudid);  
    app.get('/post/:post_uid', auth,posts.findPostById);  
    app.get('/posts', auth, posts.findAll);
    app.get('/total_posts', auth, posts.getTotalPosts);
    app.post('/posts/compose', auth, posts.compose);       
    app.post('/post/total_comments', posts.countComments);  
    // app.post('/post/total_likes', posts.countLikes);  
    app.put('/posts/:post_uid', auth, posts.update);
    app.delete('/posts/:post_uid', auth, posts.delete);

    app.put('/posts/:post_uid/likes', auth, posts.postLiked);
    app.put('/posts/:like_uid/:post_uid/dislikes', auth, posts.postDisliked);
    app.get('/posts/:post_uid/likes', auth,posts.findAllLikes);  
    app.get('/posts/likes/:studid_fld', auth,posts.findAllLikesById);  
    
    app.put('/posts/:post_uid/upload', imageUploader.upload.single('img_fld'), posts.fileUpload);
    
    app.post('/post/trends', posts.trends);   
    app.post('/posts/likes', auth,posts.findAllPostLikes);  
    
    //COMMENT ROUTES 
    app.post('/posts/:post_uid/comments', auth, comments.create);
    app.get('/posts/:post_uid/comments', auth, comments.findAll);
    app.put('/comment/:comment_uid', auth, comments.updateById);
    app.delete('/comment/:comment_uid', auth, comments.delete);  

    //REPORT ROUTES 
    app.post('/reports/create/:post_uid', auth, reports.create);
    app.get('/reports', auth, reports.findAll);  
    app.get('/total_reports', auth, reports.getTotalReports);  
    app.put('/reports/:report_uid', auth, reports.update);
}  