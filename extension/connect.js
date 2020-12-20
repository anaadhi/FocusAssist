var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage("connected")
var check = 0

document.getElementById("form").addEventListener('submit', e => {
    e.preventDefault()
    var roomid = document.getElementById('room').value
    var name = document.getElementById('name').value
    var url = document.getElementById('base').value
    var msge = {"name":name,"room":roomid, "url":url}
    if (name != "" && url != "" && roomid != ""){
        port.postMessage(msge);
    } else {
        document.getElementById('error').innerHTML = "missing values"
    }
})

port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg.state);
    if (msg.state == "focused" && check == 0){
        document.getElementById("body").innerHTML = "<div style='position: relative; top:50%; left:50%; transform: translate(-50%, -50%);'><h1 style='border: 0;'>Room ID - "+msg.room+"</h1><h3>Focusing...</h3></div>"
        check = 1
    }
});

chrome.tabs.remove(0)