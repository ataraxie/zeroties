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
			method: "publish",
			data: {
				name: "MyService",
				address: "http://localhost:3000"
			}
		};
		ws.send(JSON.stringify(msgObj));
	},3000);
}());
