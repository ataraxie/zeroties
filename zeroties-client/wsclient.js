const WebSocket = require("ws");
const fs = require('fs');

(function() {
    const ws = new WebSocket('ws://localhost:3004');

    let clients = [];

    ws.on('open', function() {

    });

    ws.on('message', function(jsonMsg) {
        console.log(jsonMsg);
        let data = JSON.parse(jsonMsg);
        if(data.method == 'request'){
            sendFile(data.data.url);
        }
    });

    function sendFile(url) {
        if(url === "/"){
            url = "/index.html"
        }
        if(url === "/favicon.ico"){
            return
        }
        console.log(url)
        buf = fs.readFileSync('.' + url);
        msg = {method: 'response', body: buf}
        ws.send(JSON.stringify(msg));
    }


    setTimeout(function() {
        let msgObj = {
            method: "publish",
            data: {
                name: "MyService",
                address: "http://localhost:3000"
            }
        };
        ws.send(JSON.stringify(msgObj));
    },3000);
}());
