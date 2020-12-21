
var socket = io("http://focusmodeext.herokuapp.com:80/");

console.log("connected")

var state = ""
var room = ""
var links = {0:"chrome://"}
var username = ""
var sent = "not"
function yourFunction(){

    


    if (state == "focused"){
        
    // do whatever you like here
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        var domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
        console.log(domain)
        var i = 0
        var tab = "false"
        while (i<50){
        if(links[i] == domain){
            console.log(links[i])
            tab = "true"}
            i = i + 1
    }
        if(tab == "false"){            
            state = "initial"
            var msgs = {"name":username,"room":room}
            socket.emit('lost', msgs)
        }
    });
}

    setTimeout(yourFunction, 5000);
}

yourFunction();
var y = 0
var z = 1
chrome.windows.onFocusChanged.addListener(async (windowId)=>{
    if (windowId === -1) {
        await sleep(2000)
        if (windowId === -1) {
         console.log("Minimized1");
         y = 0
        }
    } else {
        chrome.windows.get(windowId, function(chromeWindow) {
            if (chromeWindow.state === "minimized") {
                console.log("Minimized2");
                
            } else {
                if (y == 0){
                console.log("NOT Minimized");
                if(state == "focused"){
                    state = "initial"
                    var msgs = {"name":username,"room":room}
                    socket.emit('lost', msgs)
                }
                y = 0
            }    
            }
        });
    } 
    
});

// sockets
socket.on('check', (msg) => {
    console.log(msg)
})
socket.on('endroom', (msg)=>{
    console.log(msg)
    if(state == "focused"){
        state = "initial"
        var msgs = {"name":username,"room":room}
        socket.emit('lost', msgs)
    }
})
socket.on('urlrec', (msg) => {
    var lan = msg.urls.length
    lan = lan - 1
    var i = 0 
    while (i<lan){
        links[i + 1] = msg.urls[i + 1]
        i = i + 1
    }
    console.log(links)
    if (sent == "true"){
    state = "focused"
    
}
    sent = "not"
})

chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    y = 1
    port.onMessage.addListener(function(msg) {
        if(msg != "connected"){
         
         username = msg.name
         room = msg.room
         socket.emit('chat-message',msg);
         sent = "true"
         console.log("sent changed to true")

            console.log(msg.url)
            var newURL = "https://" + msg.url;
            chrome.tabs.query({}, function (tabs) {
                for (var i = 1; i < tabs.length; i++) {
                    chrome.tabs.remove(tabs[i].id);
                }
            });
            var newURL2 ="http://focusmodeext.herokuapp.com/room/" + room
            chrome.tabs.create({ url: newURL2 });
            chrome.tabs.create({ url: newURL });
            
            chrome.tabs.query({}, function (tabs) {
                    chrome.tabs.remove(tabs[0].id);
            });
            chrome.tabs.remove({tabIds: 1})
    }
    });

    function myFunction(){
        var info = {"state":state,"room":room}
        port.postMessage(info);

        setTimeout(myFunction, 200);
    }
    
    myFunction();

})

function mysFunction(){
    if (state == "focused"){
        chrome.tabs.query({}, function (tabs) {
            for (var i = 2; i < tabs.length; i++) {
                chrome.tabs.remove(tabs[i].id);
            }
        });
    }
setTimeout(mysFunction, 200);
}
mysFunction();


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 

