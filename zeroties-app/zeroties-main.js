const WebSocket = require("ws");
const zeroties = require('./ZerotiesServer')
const {dnssdapi} = require("./dnssd-api");


const DEFAULT_WS_PORT = 3004

const wss = new WebSocket.Server({ port: 3004 });

let clients = {};
let servers = {};
let services = [];

async function publish(client, name) {
    console.log("Publish: " + name);
    let zs = new zeroties.ZerotiesServer;
    await zs.start().then((addressObj) => {
        zs.registerHostSocket(client);
        dnssdapi.advertise(name, addressObj, function(response) {
            log("Publish: " + JSON.stringify(response));
        });
        servers[name] = zs;
        return Promise.resolve();
    }).catch((e) => {
        console.error(e);
        return Promise.reject(e);
    })
}

wss.on("connection", function(client) {
	let clientId = new Date().getTime();
	client.clientId = clientId;
	clients[clientId] = client;
	log("NEWCLIENT: " + clientId);
    sendServices(client);
    client.on("message", function(msgJson) {
        try {
            let msgObj = JSON.parse(msgJson);
            if (msgObj.method && msgObj.data) {
                if (msgObj.method === "publish") {
                    let payload = msgObj.data;
                    if (payload.name) {
                        client.appName = payload.name;
                        console.log("publish");
                        publish(client, payload.name).then(function(){
                            let message = {method: "connect", success: true};
                            client.send(JSON.stringify(message));
                        }).catch(function(e){
                            let message = {method: "connect", success: false, reason: e};
                            client.send(JSON.stringify(message));
                        });
                    }
                }
            }
        } catch (err) {
            error("Message was not in JSON format");
        }
    });
	client.on('close', function() {
	    console.log("closing");
        dnssdapi.stopAdvertising(client.appName);
        delete clients[clientId];
	});
});

function log(msg) {
    console.log(msg);
}

function error(msg) {
    console.error(msg);
}

function deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function sendServices(client) {
    client.send(JSON.stringify({
        method: "servicesChanged",
        services: services
    }));
}

function broadcastServices() {
    for (let clientId in clients) {
        sendServices(clients[clientId]);
    }
}

function startPollingServices() {
    let doPoll = function() {
        dnssdapi.getServices(function(response) {
            if (response.status === 200) {
                if (!deepEqual(services, response.services)) {
                    log("servicesChanged: " + JSON.stringify(response));
                    services = response.services;
                    console.log("services here:", services)
                    broadcastServices();
                }
            } else {
                error("Status != 200 getting services");
            }

        });
        setTimeout(doPoll, 1000);
    };
    doPoll();
}


startPollingServices();
