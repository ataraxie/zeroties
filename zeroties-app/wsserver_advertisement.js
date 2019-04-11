const WebSocket = require("ws");
const zeroties = require('./ZerotiesServer')
const {dnssdapi} = require("./dnssd-api");

const wss = new WebSocket.Server({ port: 3004 });

let clients = {};
let servers = {};

function publish(client, name, address) {
    console.log("Publish: " + name + " @ " + address);
    zs = new zeroties.ZerotiesServer();
    zs.start();
    zs.registerHostSocket(client);
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
        try {
            let msgObj = JSON.parse(msgJson);
            if (msgObj.method && msgObj.data) {
                if (msgObj.method === "publish") {
                    let payload = msgObj.data;
                    if (payload.name && payload.address) {
                        client.appName = payload.name;
                        client.address = payload.address;
                        publish(client, payload.name, payload.address);
                    }
                }
            }
        } catch (err) {
            console.log(err)
            error("Message was not in JSON format");
        }
    });
	client.on('close', function() {
	    console.log("closing");
        dnssdapi.stopAdvertising(client.appName, client.address);
        delete clients[clientId];
	});
});


function log(msg) {
	console.log(msg);
}

function error(msg) {
	console.error(msg);
}