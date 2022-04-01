module.exports = app => {

    const students = require('../controller/student_controller');
    const accounts = require('../controller/auth_controller');
    const posts = require('../controller/post_controller');
    const comments = require('../controller/comment_controller');
    const reports = require('../controller/reportPost_controller')
    const rooms = require('../controller/room_controller');
    const trends = require('../controller/trend_controller');
    const {auth} = require('../../src/services/token_validation');

    //upload
    const imageUploader = require('../services/image-uploader');

    // STUDENT ROUTES
    app.get('/students', students.findAll);
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
    app.put('/students/:studid_fld/change_pass', accounts.changePass);
    app.put('/students/:studid_fld/upload', imageUploader.upload.single('avatar_fld'), students.fileUpload);
    
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
    app.put('/posts/:like_uid/:post_uid/likes', auth, posts.liked);
    app.put('/posts/:like_uid/:post_uid/dislikes', auth, posts.postDisliked);
    
    app.put('/posts/:post_uid/upload', imageUploader.upload.single('img_fld'), posts.fileUpload);
    
    // TRENDING POST ROUTE
    app.get('/trends', auth,trends.getAllTrends)
    app.get('/total_trends', auth,trends.getTotalTrends)
    app.post('/post/trends', auth, posts.trends);   
    app.post('/posts/likes', auth,posts.findAllPostLikes);  
    app.post('/hashtag', auth, trends.create)
    app.post('/hashtag_relation', auth, trends.createRelation)
    
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
    app.put('/ignored_reports/:report_uid', auth, reports.update);
    app.put('/noticed_reports/:report_uid', auth, reports.updateNoticedId);
    
    //CHATROOM ROUTES
    app.get('/rooms', auth, rooms.findRooms);
    app.get('/unauthorized', auth, rooms.findUnauthorized);
    app.get('/authorized', auth, rooms.findAuthorized);
    app.post('/rooms', auth, rooms.roomid); 
    app.get('/rooms/:room_uid', auth, rooms.roomName);
    app.post('/rooms/groups/:room_uid', auth, rooms.groups); 
    app.post('/rooms/create_room', auth, rooms.createRoom);
    app.put('/auth/:room_uid', auth, rooms.updateAuth);
    app.put('/unauth/:room_uid', auth, rooms.updateUnauth);
    
    //members
    app.get('/rooms/members/:room_uid', auth, rooms.members);
    app.post('/rooms/add_member', auth, rooms.newMember); 
    app.post('/rooms/members', auth, rooms.findAllMembers);
    app.post('/rooms/leave/:studid_fld', auth, rooms.leaveRoom);
    app.put('/rooms/join/:studid_fld', auth, rooms.joinRoom);

    //message
    app.post('/rooms/message/:room_uid', auth, rooms.message);
    app.post('/room/message', auth, rooms.findMessage); 

    //ADMIN
    
    //DASHBOARD ROUTES
    app.get('/num_new_users', auth, accounts.findNewUsers);
    app.get('/total_CCS_post', auth, posts.findCCSPosts);
    app.get('/total_CBA_post', auth, posts.findCBAPosts);
    app.get('/total_CAHS_post', auth, posts.findCAHSPosts);
    app.get('/total_CHTM_post', auth, posts.findCHTMPosts);
    app.get('/total_CEAS_post', auth, posts.findCEASPosts);
}    