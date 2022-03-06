module.exports = app => {

    const students = require('../controller/student_controller');
    const accounts = require('../controller/auth_controller');
    const posts = require('../controller/post_controller');
    const comments = require('../controller/comment_controller');
    const reports = require('../controller/reportPost_controller')
    const rooms = require('../controller/room_controller');
    const {auth} = require('../../src/services/token_validation');

    //upload
    const imageUploader = require('../services/image-uploader');

    // STUDENT ROUTES
    app.get('/students',auth, students.findAll);
    app.get('/total_students', auth, students.getTotalUsers);
    app.get('/students/:studid_fld',auth, students.findOne); 
    app.post('/students/create', auth, students.create);
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
    app.post('/posts/compose', auth, imageUploader.upload.single('img_fld'), posts.compose);       
    app.post('/post/total_comments', posts.countComments);  
    // app.post('/post/total_likes', posts.countLikes);  
    app.put('/posts/:post_uid', auth, imageUploader.upload.single('img_fld'), posts.update);
    app.delete('/posts/:post_uid', auth, posts.delete);

    // POST LIKES ROUTES
    app.get('/posts/:post_uid/likes', auth,posts.findAllLikes);  
    app.get('/posts/likes/:studid_fld', auth,posts.findAllLikesById);  
    app.put('/posts/:post_uid/likes', auth, posts.postLiked);
    app.put('/posts/:like_uid/:post_uid/dislikes', auth, posts.postDisliked);
    
    app.put('/posts/:post_uid/upload', imageUploader.upload.single('img_fld'), posts.fileUpload);
    
    // TRENDING POST ROUTE
    app.post('/post/trends', posts.trends);   
    app.post('/posts/likes', auth,posts.findAllPostLikes);  
    
    //COMMENT ROUTES 
    app.get('/posts/:post_uid/comments', auth, comments.findAll);
    app.post('/posts/:post_uid/comments', auth, comments.create);
    app.put('/comment/:comment_uid', auth, comments.updateById);
    app.delete('/comment/:comment_uid', auth, comments.delete);  

    //REPORT ROUTES 
    app.get('/reports', auth, reports.findAll);  
    app.get('/noticed_reports', auth, reports.findNoticed);  
    app.get('/ignored_reports', auth, reports.findIgnored);  
    app.get('/total_reports', auth, reports.getTotalReports);  
    app.post('/reports/create/:post_uid', auth, reports.create);
    app.put('/reports/:report_uid', auth, reports.update);
    app.put('/noticed_reports/:report_uid', auth, reports.updateNoticedId);
    
    //CHATROOM ROUTES
    app.get('/rooms', auth, rooms.findRooms);
    app.get('/unauthorized', auth, rooms.findUnauthorized);
    app.get('/authorized', auth, rooms.findAuthorized);
    app.post('/rooms', auth, rooms.roomid); 
    app.get('/rooms/:room_uid', auth, rooms.roomName);
    app.post('/rooms/groups/:room_uid', auth, rooms.groups); 
    app.post('/rooms/create_room', auth, rooms.createRoom);
    app.post('/rooms/leave/:studid_fld', auth, rooms.leaveRoom);
    app.put('/rooms/join/:studid_fld', auth, rooms.joinRoom);
    app.put('/room/:room_uid', auth, rooms.update);
    
    //members
    app.get('/rooms/members/:room_uid', auth, rooms.members);
    app.post('/rooms/add_member', auth, rooms.newMember); 
    app.post('/rooms/members', auth, rooms.findAllMembers);
    app.post('/rooms/left_members', auth, rooms.findAllLeftMembers);

    //message
    app.post('/rooms/message/:room_uid', auth, rooms.message);
    app.post('/room/message', auth, rooms.findMessage); 
}    