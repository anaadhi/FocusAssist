const express = require('express');
const http = require('http')
const app = express()
const path = require("path");
const server = http.createServer(app)
const socket = require('socket.io')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const { json } = require('body-parser');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const io = socket(server,{
    cors: {
        origin: '*',
    }
});

var room = "{rooms:[]}"

app.get('/', (req, res) => {
    res.render("home")
})

app.post('/',(req, res) => {
    var id = Math.floor(Math.random()*(99999-10000+1)+10000);
    var pass = req.body.pass
    res.cookie('token', pass)
    res.redirect('/room/' + id)
})

app.get('/room/:id', (req, res) => {
    res.render('room', {"id":req.params.id}); 
})

io.on('connection', (socket) => {
    socket.on('chat-message', (msg) => {
      console.log(msg)
      var room = Number(msg.room)
      socket.join(room)
      socket.to(room).broadcast.emit('joins',msg.name);
    });
    socket.on('details', (msg, room) => {
        socket.broadcast.emit('check',msg)
        console.log(room)
    });
    socket.on('room', (id) => {
        id = Number(id)
        socket.join(id)
        console.log(id)
    })
    socket.on('urls', (msg) => {
        room = msg.room
        room =  Number(room)
        socket.to(room).broadcast.emit('urlrec',msg);
    })
    socket.on('lost', (msg) => {
        console.log(msg)
        room = msg.room
        room = Number(room)
        socket.to(room).broadcast.emit('end',msg.name);
    })
});



const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log("listening on port " + port)
})