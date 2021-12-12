const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const auth = require('./src/services/setUser');
// const { authUser } = require('./src/services/auth');

const app = express();
const PORT = 5000 || process.env.PORT;

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/uploads', express.static('uploads'));
// app.use(auth.setUser);

// app.get('/admin', authUser, (req, res) => {
//     res.send('Admin Page')
// })

var corsOptions = {
    origin: 'http://localhost:5000/'
}


require('./src/routes/student_routes.js')(app);

app.listen(PORT, (err, res) => {
    if(err){
        throw(err);
    }
    console.log(`Server is running on port ${PORT}`);
})