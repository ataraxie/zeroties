
const WebSocket = require("ws");
const http = require('http');
const uuidv4 = require('uuid/v4'); // generates a random uuid ( for client identification over websocket communication )
const uuidv5 = require('uuid/v5'); // geenrates a consistent uuid for a given name and namespace combination

const DEFAULT_HTTP_SERVER_PORT = 9090;


function ZerotiesServer() {
    this.server = new http.Server();
}


ZerotiesServer.prototype.start = function(opts){
    console.log("start");
    return new Promise((resolve, reject) => {
        if(opts){
            port = opts.port;
        }
        else{
            port = DEFAULT_HTTP_SERVER_PORT;
        }
        this.server.listen({port: port, host: this.address});
        this.wss = new WebSocket.Server({server: this.server});
        this.server.on("request", (req,res) => {this.onRequest(req, res)});
        this.wss.on("connection", (ws, req) => {this.onWebsocket(ws)});
        resolve(true);
    })
};


ZerotiesServer.prototype.registerHostSocket = function(socket){
    this.hostSocket = socket;
};

ZerotiesServer.prototype.onWebsocket = function(ws, req){
    console.log("onWebsocket");
    uuid = uuidv4();
    data = {headers:req.headers};
    msgObj = {method: 'wsConnectionRequest', data: data, uuid: uuid}
    //todo: requests other than GET
    //todo: timeout
    this.hostSocket.send(JSON.stringify(msgObj));
    var self = this;

    //expect a response to this websocket of the format {method: "response", body: JSON.stringified Buffer}
    function responseHandler(response){
        try {
            let msgObj = JSON.parse(response);
            if (msgObj.method == "wsConnectionResponse" && msgObj.data) {
                if(msgObj.data.status == 200){
                    //todo: something here
                    //msgobj contains event subscriptions
                }
                self.hostSocket.removeListener("message", responseHandler);
            }
        } catch (err) {
            error("Message was not in JSON format");
        }
    }
    this.hostSocket.on("message", responseHandler);

}

ZerotiesServer.prototype.subscribeClientToWSEvent = function(client, uuid, event){
    client.on(event, function(e){
        client.send({uuid: uuid, payload: e, event: event})
    });
    client.on("message", (msgJson) => {
        msgObj = JSON.parse(msgJson);
        msgObj.uuid = uuid;
        this.hostSocket.send(JSON.stringify(msjObj))
    })
}

ZerotiesServer.prototype.onRequest = function(req, res){
    console.log("onRequest");
    data = {headers:req.headers, url: req.url}
    msgObj = {method: 'request', data: data}
    //todo: requests other than GET
    //todo: timeout
    this.hostSocket.send(JSON.stringify(msgObj));
    var self = this;

    //expect a response to this websocket of the format {method: "response", body: stringified UTF-16 ArrayBuffer}
    function responseHandler(response){
        try {
            console.log(response);
            let msgObj = JSON.parse(response);
            if (msgObj.method == "response" && msgObj.body) {
                let ab = str2ab(msgObj.body);
                let buf = Buffer.from(ab);
                console.log("response");
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



exports.ZerotiesServer = ZerotiesServer;


