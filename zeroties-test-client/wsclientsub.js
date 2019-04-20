const WebSocket = require("ws");

(function() {
    const ws = new WebSocket('ws://localhost:3005');

    let clients = [];

    ws.on('open', function() {

    });

    ws.on('message', function(jsonMsg) {
        let data = JSON.parse(jsonMsg);
    });

    setTimeout(function() {
        let msgObj = {
            method: "subscribe",
            data: {
                address: "http://localhost:3000"
            }
        };
        ws.send(JSON.stringify(msgObj));
    },3000);
}());
