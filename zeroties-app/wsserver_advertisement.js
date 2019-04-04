const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3004 });

let clients = {};

wss.on("connection", function(client) {
	let clientId = new Date().getTime();
	client.clientId = clientId;
	clients[clientId] = client;
	log("NEWCLIENT: " + clientId);
	client.on("message", function(msgJson) {
		log("MESSAGE: " + msgJson);
		try {
			let msgObj = JSON.parse(msgJson);
			if (msgObj.route === "welcome") {
				let clientId = msgObj.body.clientId;
				clients[clientId] = client;
				client.send(msgJson);
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