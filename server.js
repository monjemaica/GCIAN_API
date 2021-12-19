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
    origin: 'http://localhost:5000/'
}


require('./src/routes/student_routes.js')(app);

io.on('connection', (socket) => {
    console.log('New WS Connection...');

    socket.on('join', (data) => {
        const users = userJoin(socket.id, data.user, data.room);

        console.log('users-arr: ', users)
        socket.join(data.room);
        console.log(`${data.user} joined the room : ${data.room}`);
        socket.broadcast.to(data.room).emit('new-user-joined', {user:data.user, message:'has joined this room'});

        io.to(data.room).emit('room-users', {room: data.room, users: getRoomUsers(data.room)})
    })

    socket.on('leave', (data)=>{
        const users = userLeave(socket.id);
        console.log('users-arr: ', users)
        console.log(`${data.user} left the room : ${data.room}`);
        socket.broadcast.to(data.room).emit('left-room', {user:data.user, message:'has left this room'});
        socket.leave(data.room);
        io.to(data.room).emit('room-users', {room: data.room, users: getRoomUsers(data.room)});
    })

    socket.on('message', (data) => {
        io.in(data.room).emit('new-message', {user:data.user, message: data.message, date: moment().format()});
    } )

    // socket.emit('message', formatMessage('chatroom', 'Welcome to ChatRoom'));
    
    // socket.broadcast.emit('message', formatMessage('chatroom', 'A user has joined the chat'));

    // socket.on('disconnect', () => {
    //     io.emit('message', 'chatroom', 'A user has left the chat')
    // }); 

    // socket.on('chat-message', (message) => {
    //   io.emit('message', formatMessage('USER', message));
    //   console.log(message);
    // });
});

server.listen(PORT, (err, res) => { 
    if(err){
        throw(err);
    }
    console.log(`Server is running on port ${PORT}`);
})