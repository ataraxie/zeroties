let servers = {};

function initServer(server) {
	let ws = new WebSocket('ws://localhost:3004');
	ws.addEventListener("open", function(e) {
		// ws.send(JSON.stringify({ route: "_server", body: {} }));
		console.log("OPEN");
		console.log(e);
	});
	ws.addEventListener("message", function(e) {
		console.log("MESSAGE");
		console.log(e);
	});
	if (server.onwebsocket) {
		server.onwebsocket({
			accept: function() {
				return ws;
			}
		});
	}

}

window.navigator.publishServer = function(name) {
	return new Promise(function(fulfill, reject) {
		if (servers[name]) {
			reject(`There is already a server with name ${name}`);
		} else {
			servers[name] = {};
			fulfill(servers[name]);
			setTimeout(function() {
				initServer(servers[name]);
			}, 1);

		}
	});
};