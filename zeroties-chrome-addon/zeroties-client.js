(function() {

	try {
		let ws = new WebSocket('ws://localhost:3005');

		ws.addEventListener('open', function (event) {
			console.log("WS OPEN");
		});

		ws.addEventListener('message', function (event) {
			var payload = JSON.parse(event.data);
			if (payload.method === "servicesChanged") {
				console.log(payload.services);
			}
		});
	} catch (err) {
		console.log("Could not establish WS connection");
	}


	// setTimeout(function() {
	// 	var msgObj = {
	// 		method: "publish",
	// 		data: {
	// 			name: "MyService",
	// 			address: "http://localhost:3000"
	// 		}
	// 	};
	// 	ws.send(JSON.stringify(msgObj));
	// },3000);

	//document.dispatchEvent(new CustomEvent("zeroties.connect");

}());

