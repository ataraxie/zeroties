const WebSocket = require("ws");
const zeroties = require('./ZerotiesServer')
const {dnssdapi} = require("./dnssd-api-mock");

const wss = new WebSocket.Server({ port: 3004 });

let clients = {};
let servers = {};

function publish(client, name, address) {
    console.log("Publish: " + name + " @ " + address);
    zs = new zeroties.ZerotiesServer();
    zs.start();
    zs.registerRequestResponseSocket(client);
    dnssdapi.advertise(name, address, function(response) {
        log("Publish: " + JSON.stringify(response));
    });
    servers[name] = zs;
}

wss.on("connection", function(client) {
	let clientId = new Date().getTime();
	client.clientId = clientId;
	clients[clientId] = client;
	log("NEWCLIENT: " + clientId);
    client.on("message", function(msgJson) {
        log("MESSAGE: " + msgJson);
        try {
            let msgObj = JSON.parse(msgJson);
            if (msgObj.method && msgObj.data) {
                if (msgObj.method === "publish") {
                    let payload = msgObj.data;
                    if (payload.name && payload.address) {
                        publish(client, payload.name, payload.address);
                    } else {
                        error("Expected fields name and address but found: ", JSON.stringify(payload));
                    }
                } else {
                    error("Currently only 'publish' supported but found: ", msgObj.method);
                }
            } else {
                error("Expected fields method and data but found: ", msgJson);
            }
        } catch (err) {
            error("Message was not in JSON format");
        }
    });
	client.on('close', function() {
		delete clients[clientId];
	});
});


function log(msg) {
	console.log(msg);
}

function error(msg) {
	console.error(msg);
}