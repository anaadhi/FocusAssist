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
    var id = Math.floor(Math.random()*(99999-10000+1)+10000);
    res.cookie('token', id)
    res.redirect('/room/' + id)
})

app.get('/room/:id', (req, res) => {
    var token = req.cookies['token'];
    if(token == req.params.id){
        res.render('dashboard', {"id":req.params.id});
    } else {
        res.render('studentboard', {"id":req.params.id});
    }
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
    });
    socket.on('room', (id) => {
        id = Number(id)
        socket.join(id)
    })
    socket.on('urls', (msg) => {
        room = msg.room
        room =  Number(room)
        socket.to(room).broadcast.emit('urlrec',msg);
    })
    socket.on('lost', (msg) => {
        room = msg.room
        room = Number(room)
        socket.to(room).broadcast.emit('end',msg.name);
    })
    socket.on('studs', (msg)=>{
        room = msg.room
        room = Number(room)
        console.log(msg)
        var newmsg = {'links':msg.urlbar,'studs':msg.studs, 'pog':msg.prog}
        socket.to(room).broadcast.emit('students',newmsg);
    })
    socket.on('close', (msg) => {
        room = Number(msg)
        console.log(msg)
        socket.to(room).broadcast.emit('endroom',msg);
    })
});



const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log("listening on port " + port)
})