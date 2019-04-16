
var servers = {};

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

function initServer(name) {
    server = {};
	return new Promise(function(fulfill, reject){

	    /*
	    setTimeout(function(){
	        httpProxyWS.terminate();
	        reject("timeout: did not initialize server in time")
        }, 10000);
        */

		let httpProxyWS = new WebSocket('ws://localhost:3004');

        httpProxyWS.addEventListener("open", function(e) {
            message = {method: "publish", data: {name: name, address: "0.0.0.0"}}
            httpProxyWS.send(JSON.stringify(message));
        });

        httpProxyWS.addEventListener("message", function(e) {
            let msgObj = parse(e);
            if(msgObj.method && msgObj.method === 'connect'){
                try{
                    let success = msgObj.success;
                    if(success){
                        fulfill(server);
                    }
                    else{
                        reject(msgObj.reason);
                    }
                }
                catch(e){
                        console.error("malformed JSON message")
                        console.log(e);
                }
            }
            else if(msgObj.method && msgObj.method === 'request'){
                try{
                    let request = new Request(msgObj.data.url);

                    server.onfetch({request: request, respondWith: function(response){
                            response.arrayBuffer().then(function(ab){
                                let buf = new Uint8Array(ab).reduce(function (data, byte) {return data + String.fromCharCode(byte);}, '');
                                msg = {method: 'response', body: buf, uuid: msgObj.uuid}
                                httpProxyWS.send(JSON.stringify(msg));
                            });
                        }})
                }
                catch(e){
                    console.error("malformed JSON message")
                    console.log(e);
                }
            } else if (msgObj.method && msgObj.method === 'wsForward'){
                let forwardedClientWS = new WebSocket(msgObj.data.serverAddress, "proxy");
                forwardedClientWS.addEventListener("open", function(){
                    let message = {method: "init", uuid: msgObj.uuid};
                    forwardedClientWS.send(JSON.stringify(message));
                });
                let message = {method: "wsForwardResponse", uuid: msgObj.uuid};
                httpProxyWS.send(JSON.stringify(message));

                httpProxyWS.addEventListener("message", proxyHandshake);
                function proxyHandshake(e){
                    let handshakeObj = parse(e);
                    if(handshakeObj.method && handshakeObj.method === 'wsProxyHandshake' && handshakeObj.uuid === msgObj.uuid){
                        console.log("handshake");
                        server.onwebsocket({
                            accept: function() {
                                return forwardedClientWS;
                            }
                        });
                        if(forwardedClientWS.readyState === WebSocket.OPEN){
                            forwardedClientWS.dispatchEvent(new Event("open"));
                        }
                    }
                }
            }
        });
        httpProxyWS.addEventListener("close", function(e){
			console.log(e);
			console.log("CLOSE");
            delete servers[name];
        });
        httpProxyWS.addEventListener("error", function(e){
            console.error(e);
			console.log("ERROR");
			reject(e)
		});
    })
}

window.navigator.publishServer = function(name) {
	return new Promise(function(fulfill, reject) {
		if (servers[name]) {
			reject(`There is already a server with name ${name}`);
		} else {
            initServer(name).then(function(server) {
                servers[name] = server;
                fulfill(server);
            }).catch((e) => {
                reject(e);
            });
		}
	});
};

if(!window.executed){
    window.executed = true;
    function establishWebsocket(servicesChangedCallback) {
        console.log("establishws");
        try {
            let ws = new WebSocket('ws://localhost:3005');

            ws.addEventListener('open', function (event) {
                console.log("WS OPEN");
            });

            ws.addEventListener('message', function (event) {
                var payload = JSON.parse(event.data);
                if (payload.method === "servicesChanged") {
                    servicesChangedCallback(payload.services);
                }
            });
        } catch (err) {
            console.log("Could not establish WS connection");
        }
    }

    setTimeout(function(){
        establishWebsocket(function(services){
            let event = new Event('flywebServicesChanged');
            detail = {services: services};
            event.detail = JSON.stringify(detail);
            window.dispatchEvent(event);
        })}, 1000);
}