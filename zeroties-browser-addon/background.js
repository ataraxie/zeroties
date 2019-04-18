let clients = {};

function establishWebsocket(servicesChangedCallback) {
    try {
        let ws = new WebSocket('ws://localhost:3004');

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

function onConnectPort(port) {
    establishWebsocket(function(services) {
        console.log("ADDON PORT CONNECT");
        port.postMessage(services);
    });
}

if (chrome && chrome.extension && chrome.extension.onConnect) {
    chrome.extension.onConnect.addListener(onConnectPort);
} else if (browser && browser.browserAction) {
    browser.runtime.onConnect.addListener(onConnectPort)
}



