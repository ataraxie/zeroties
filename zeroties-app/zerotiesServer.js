
const WebSocket = require("ws");
const http = require('http');
const uuidv4 = require('uuid/v4'); // generates a random uuid ( for client identification over websocket communication )
const uuidv5 = require('uuid/v5'); // geenrates a consistent uuid for a given name and namespace combination
const DEFAULT_HTTP_SERVER_PORT = 9090;


var zerotiesServer;

function getInstance(){
    if(!zerotiesServer){
        zerotiesServer = new ZerotiesServer();
    }
    return zerotiesServer;
}

function ZerotiesServer() {
    this.server = new http.Server();
    this.clientsockets = {}
}

ZerotiesServer.prototype.start = function(){
    console.log("start");
    return new Promise((resolve, reject) => {
        if(this.server.listening){

        }
        else{
            this.server.on("error", (e) => {
                reject(e);
            });
            this.server.listen({port:9090}, () => {
                this.wss = new WebSocket.Server({server: this.server});
                this.server.on("request", (req,res) => {this.onRequest(req, res)}); //TODO: error handling - make sure socket is open
                this.wss.on("connection", (ws, req) => {
                    if(ws.protocol === "proxy"){
                        this.onProxy(ws, req);
                    } else {
                        this.onWebsocket(ws, req);
                    }
                });
                resolve(true);
            });

        }
    });
};


ZerotiesServer.prototype.registerHostSocket = function(socket){
    this.hostSocket = socket;
    socket.on("close", () => {
        this.server.close();
        this.wss.close();
    })
};

ZerotiesServer.prototype.onProxy = function(ws, req){
    ws.addEventListener("message", proxyInit);
    let self = this;
    function proxyInit(e){
        try{
            msgObj = JSON.parse(e.data);
            console.log(msgObj)
            if(msgObj.method && msgObj.method == "init"){
                ws.removeEventListener("message", proxyInit);
                let uuid = msgObj.uuid;
                let socket = self.clientsockets[uuid];

                ws.on("message", function(e){
                    console.log("forward from server to client", uuid);
                    socket.send(e);
                });
                ws.on("close", function(){
                    socket.terminate();
                    delete self.clientsockets[uuid];
                });
                //todo: onerror handling?

                socket.on("message", function(e){
                    console.log("forward from client to server", uuid);
                    ws.send(e);
                });
                socket.on("close", function(){
                    ws.terminate();
                    delete self.clientsockets[uuid];
                });
                socket.state = "READY";
                socket.completeHandshake && socket.completeHandshake();
            }
        } catch(err){
            console.error("message not in JSON format");
            console.error(err);
        }
    }

}

ZerotiesServer.prototype.onWebsocket = function(ws, req){
    let uuid = uuidv4();
    let data = {serverAddress:"ws://localhost:9090"}; //TODO: fix this
    let msgObj = {method: 'wsForward', data: data, uuid: uuid};
    this.hostSocket.send(JSON.stringify(msgObj));
    var self = this;
    this.clientsockets[uuid] = ws;
    this.hostSocket.on("message", proxyHandshake)

    function proxyHandshake(e){
        msgObj = JSON.parse(e);
        console.log(msgObj)
        if(msgObj.method && msgObj.method === "wsForwardResponse"){
            self.hostSocket.removeEventListener("message", proxyHandshake)
            function completeHandshake(){
                console.log("complete");
                message = {method: "wsProxyHandshake", uuid: msgObj.uuid}
                self.hostSocket.send(JSON.stringify(message));
            }
            if(ws.state && ws.state === "READY"){
                completeHandshake();
            }
            else{
                ws.completeHandshake = completeHandshake;
            }
        }
    }
}

ZerotiesServer.prototype.subscribeClientToWSEvent = function(client, uuid, event){
    client.on(event, (e) => {
        this.hostSocket.send(JSON.stringify({method: 'wsEventRequest', uuid: uuid, payload: JSON.parse(e), event: event}))
    });
}

ZerotiesServer.prototype.onRequest = function(req, res){
    let uuid = uuidv4(); //we need a uuid to distinguish between responses for different requests
    data = {headers:req.headers, url: req.url};
    msgObj = {method: 'request', data: data, uuid: uuid};
    //todo: requests other than GET
    //todo: timeout
    this.hostSocket.send(JSON.stringify(msgObj));
    var self = this;
    //expect a response to this websocket of the format {method: "response", body: stringified UTF-8 ArrayBuffer}
    function responseHandler(response){
        try {
            let msgObj = JSON.parse(response);
            if (msgObj.method == "response" && msgObj.body && msgObj.uuid == uuid) {
                let ab = str2ab(msgObj.body);
                let buf = Buffer.from(ab);
                self.sendResponse(buf, res);
                self.hostSocket.removeListener("message", responseHandler);
            }
        } catch (err) {
            error("Message was not in JSON format");
        }
    }
    this.hostSocket.on("message", responseHandler);
};

ZerotiesServer.prototype.sendResponse = function(content, response){
   //todo: set headers
   response.end(content);
};

function str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}



exports.getInstance = getInstance;


