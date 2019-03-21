// chrome.extension.onConnect.addListener(function(port) {
//     console.log("Connected .....");
//     // port.onMessage.addListener(function(msg) {
//     //     console.log("message recieved" + msg);
//     //     port.postMessage("Hi Popup.js");
//     // });
//
//     port.postMessage("TEST");
// });


let servies = [];


function establishWebsocket(servicesChangedCallback) {
    try {
        let ws = new WebSocket('ws://localhost:3005');

        ws.addEventListener('open', function (event) {
            console.log("WS OPEN");
        });

        ws.addEventListener('message', function (event) {
            var payload = JSON.parse(event.data);
            if (payload.method === "servicesChanged") {
                servicesChangedCallback(JSON.stringify(payload.services));
            }
        });
    } catch (err) {
        console.log("Could not establish WS connection");
    }
}

chrome.extension.onConnect.addListener(function(port) {
    console.log("CONNECT");
    establishWebsocket(function(services) {
        port.postMessage(services);
    });
});


