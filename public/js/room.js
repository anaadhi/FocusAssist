var socket = io("http://focusmodeext.herokuapp.com:80/");

console.log("connected")

var id = document.getElementById('roomid').innerHTML
var id = String(id)
socket.emit('room', id)

socket.on('chat-message', (msg) => {
    console.log(msg)
})

socket.on('joins', (msg1) => {
    try{
    var x = document.getElementById(msg1).innerHTML
    } catch(err){x = "null"}
    console.log(x)
    if(x == "null"){
        msg1=msg1.replace(/ /g,"_");
    var ele = "<li>"+msg1+"<span id="+msg1+">Focused</span></li>"
    document.getElementById("ul").innerHTML += ele
    }
})

socket.on('end', (msg) => {
    console.log(msg)
    msg=msg.replace(/ /g,"_");
    document.getElementById(msg).innerHTML = "lost focus"
})

document.getElementById("form").addEventListener('submit', e => {
    e.preventDefault()
    msg = "working"
    socket.emit('details',msg);
})

function yourFunction(){
    // do whatever you like here
    i = 0
    var url = ""
    msg = {"urls":[],"room":id}
    while (i<25){
        msg.urls[i] = url
        try{
            url = document.getElementById("n"+i).innerHTML
        } catch(err){
            i = 24
        }
         
         i = i + 1
        }
    console.log(msg)
    socket.emit('urls',msg);


    setTimeout(yourFunction, 5000);
}

yourFunction();

socket.on('check', (msg) => {
    console.log(msg)
})