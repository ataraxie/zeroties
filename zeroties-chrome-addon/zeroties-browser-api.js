let servers = {};


function parse(e){
    try{
        let data = JSON.parse(e.data);
        return data;
    }
    catch(e){
        console.error("message not in JSON format");
        console.log(e);
    }
}

function initServer(server) {
	return new Promise(function(fulfill, reject){

		let ws = new WebSocket('ws://localhost:3004');
		ws.addEventListener("open", function(e) {
			fulfill(server);
		});
		ws.addEventListener("message", function(e) {
				let msgObj = parse(e)
				console.log(msgObj);
				if(msgObj.method && msgObj.method == 'request'){
					try{
						let request = new Request(msgObj.data.url);
                        server.onfetch({request: request, respondWith: function(response){
								console.log(response);
								response.arrayBuffer().then(function(ab){
									let buf = String.fromCharCode.apply(null, new Uint8Array(ab));
                                    msg = {method: 'response', body: buf}
                                    ws.send(JSON.stringify(msg));
                                });
						}})
					}
					catch(e){
						console.error("malformed JSON message")
						console.log(e);
					}
				}
				else if(msgObj.method && msgObj.method == 'wsEventRequest'){
					try{
						//todo:
					}
					catch(e){
						console.error("malformed JSON message")
						console.log(e)
					}
				}
				else if(msgObj.method && msgObj.method == 'wsConnectionRequest'){
					try{
						//todo:
					}
					catch(e){
                        console.error("malformed JSON message")
                        console.log(e)
					}
				}
		});
		ws.addEventListener("close", function(e){
			console.log(e);
			console.log("CLOSE");
		});
		ws.addEventListener("error", function(e){
			console.log("ERROR");
			reject(e);
		});
		if (server.onwebsocket) {
			server.onwebsocket({
				accept: function() {
					return ws;
				}
			});
		}
		server.ws = ws;
    })
}

window.navigator.publishServer = function(name) {
	return new Promise(function(fulfill, reject) {
		if (servers[name]) {
			reject(`There is already a server with name ${name}`);
		} else {
			servers[name] = {};
			initServer(servers[name]).then(function(server){
                message = {method: "publish", data: {name: name, address: "0.0.0.0"}}
                server.ws.send(JSON.stringify(message));
                fulfill(server);
            }
        );
		}
	});
};