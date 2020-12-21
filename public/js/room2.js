var socket = io("http://focusmodeext.herokuapp.com:80/");

console.log("connected")

var l = 1

var id = document.getElementById('roomid').innerHTML
var id = String(id)
socket.emit('room', id)

socket.on('chat-message', (msg) => {
    console.log(msg)
})

// socket.on('joins', (msg1) => {
//     msg1=msg1.replace(/ /g,"_");
//     try{
//     var x = document.getElementById(msg1).innerHTML
//     } catch(err){x = "null"}
//     console.log(x)
//     if(x == "null"){
//     var ele = "<div class='unit'><h3 id='n"+msg1+"'>"+msg1+"</h3><div class='grCCont' id='"+msg1+"'><div class='grC ch'></div></div></div>"
//     document.getElementById("units").innerHTML += ele
//     }
// })

// socket.on('end', (msg) => {
//     console.log(msg)
//     msg=msg.replace(/ /g,"_");
//     document.getElementById(msg).innerHTML = "<div class='grC on'>"
//     var d = new Date();
//     var n = d.getMinutes();
//     var f = d.getHours();
//     document.getElementById("n"+msg).innerHTML += " - <span style='color:grey'>"+f+":"+n+"</span>";
// })

// document.getElementById("form").addEventListener('submit', e => {
//     e.preventDefault()
//     var newlink = document.getElementById('link').value
//     var link = "<li id='n"+l+"' class='link'>"+newlink+"</li>"
//     document.getElementById('gr2').innerHTML += link
//     l = l + 1
//     document.getElementById('link').value = null
// })

// function yourFunction(){
//     // do whatever you like here
//     i = 0
//     var url = ""
//     msg = {"urls":[],"room":id}
//     while (i<25){
//         msg.urls[i] = url
//         try{
//             url = document.getElementById("n"+i).innerHTML
//         } catch(err){
//             i = 24
//         }
         
//          i = i + 1
//         }
//     console.log(msg)
//     socket.emit('urls',msg);

//     var studs = document.getElementById('units').innerHTML
//     var stud = {"studs":studs,"room":id}
//     socket.emit('studs',stud)
//     setTimeout(yourFunction, 5000);
// }

// yourFunction();

socket.on('check', (msg) => {
    console.log(msg)
})
socket.on("students", (msg) => {
    console.log(msg)
    document.getElementById('units').innerHTML = msg.studs
    document.getElementById('gr3').innerHTML = msg.links
    document.getElementById('num').innerHTML = msg.pog
})

function copylink(){
    console.log("copied")
    var copyText = document.getElementById("urlbar").innerHTML;
    var textbox = document.getElementById("temp");
    textbox.style.display = "inline"
    textbox.value = copyText
    textbox.select();
    textbox.setSelectionRange(0, 99999); 
    document.execCommand("copy");
    textbox.style.display = "none"
}

function copyid(){
    console.log("copied")
    var copyText = document.getElementById("roomid").innerHTML;
    var textbox = document.getElementById("temp");
    textbox.style.display = "inline"
    textbox.value = copyText
    textbox.select();
    textbox.setSelectionRange(0, 99999); 
    document.execCommand("copy");
    textbox.style.display = "none"
}
