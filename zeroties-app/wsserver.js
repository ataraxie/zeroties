const WebSocket = require("ws");
const {dnssdapi} = require("./dnssd-api");

const wss = new WebSocket.Server({ port: 3005 });

let clients = [];
let services = [];

function publish(name, address) {
	console.log("Publish: " + name + " @ " + address);
	dnssdapi.advertise(name, address, function(response) {
		log("Publish: " + JSON.stringify(response));
	});
}

function log(msg) {
	console.log(msg);
}

function error(msg) {
	console.error(msg);
}

function startPollingServices() {
	let doPoll = function() {
		dnssdapi.getServices(function(response) {
			if (response.status === 200) {
				log("getServices: " + JSON.stringify(response));
				services = response.services;
			} else {
				error("Status != 200 getting services");
			}

		});
		setTimeout(doPoll, 4000);
	};
	doPoll();
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
						publish(payload.name, payload.address);
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
});

startPollingServices();
