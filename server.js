const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const moment = require('moment');
const {userJoin,getRoomUsers,userLeave} = require('./src/utils/messages')
// const auth = require('./src/services/setUser');
// const { authUser } = require('./src/services/auth');

const PORT = 5000 || process.env.PORT;

const http = require('http');
const server = http.Server(app);

const io = require("socket.io")(server, {
    cors: {
      origin: "*"
    }
  });

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'src')));
// app.use(auth.setUser);

// app.get('/admin', authUser, (req, res) => {
//     res.send('Admin Page')
// })

var corsOptions = {
    // origin: 'http://192.168.100.17:5000/'
    origin: 'http://localhost:5000/'
}


require('./src/routes/student_routes.js')(app);

// error handler
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

// socket io
io.on('connection', (socket) => {
    console.log('New WS Connection...');
    socket.emit('test', 'data testing');
    
    socket.on('join', (data) => {
        const users = userJoin(data.room_uid, data.studid_fld, data.user, data.rname_fld);

        console.log('users-arr: ', users)
        socket.join(data.room_uid);
        console.log(`${data.user} joined the room : ${data.rname_fld}`);
        socket.broadcast.to(data.room_uid).emit('new-user-joined', {studid_fld:data.studid_fld, user:data.user, message_fld:'has joined this room', avatar_fld:data.avatar_fld, is_created_at_fld: moment().format()});

        io.to(data.room_uid).emit('room-users', {
            room_uid: data.room_uid,
            studid_uid: data.studid_uid, 
            rname_fld: data.rname_fld, 
            user: data.user, 
            users: getRoomUsers(data.room_uid)
        });
    })

    socket.on('leave', (data)=>{ 
        const user = userLeave(socket.id);
        console.log(`${data.user} left the room : ${data.room_uid}`);
        socket.broadcast.to(data.room_uid).emit('left-room', {studid_fld:data.studid_fld, user:data.user, message_fld:'has left this room', avatar_fld:data.avatar_fld, is_created_at_fld: moment().format()});
        socket.leave(data.room_uid);
        io.to(data.room_uid).emit('room-users', {room: data.room_uid, users: getRoomUsers(data.rname_fld)});
    })

    socket.on('message', (data) => {
        console.log('message: ', data.message_fld);
        console.log('sent by: ', data.user);
        console.log('room: ', data.room_uid);
        console.log('avatar ', data.avatar_fld);
        io.in(data.room_uid).emit('new-message', {studid_fld:data.studid_fld,  user:data.user, message_fld: data.message_fld, avatar_fld:data.avatar_fld, is_created_at_fld: moment().format()});
    } )

    socket.on('members', (data) => {
        console.log('members: ', data.data.studid_fld);
        socket.broadcast.emit('room-members', {studid_fld:data.data.studid_fld, avatar_fld: data.data.avatar_fld, fname_fld: data.data.fname_fld, mname_fld: data.data.mname_fld, lname_fld: data.data.lname_fld});
    } )
    
});

server.listen(PORT, (err, res) => { 
    if(err){
        throw(err);
    }
    console.log(`Server is running on port ${PORT}`);
})