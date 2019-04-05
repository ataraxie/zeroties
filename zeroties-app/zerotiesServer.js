
const WebSocket = require("ws");
const http = require('http');

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
        resolve(true);
    })
};


ZerotiesServer.prototype.registerRequestResponseSocket = function(socket){
    this.requestResponseWS = socket;
};

ZerotiesServer.prototype.onRequest = function(req, res){
    console.log("onRequest");
    data = {headers:req.headers, url: req.url}
    msgObj = {method: 'request', data: data}
    //todo: requests other than GET
    //todo: timeout
    this.requestResponseWS.send(JSON.stringify(msgObj));
    var self = this;

    //expect a response to this websocket of the format {method: "response", body: JSON.stringified Buffer}
    function responseHandler(response){
        try {
            let msgObj = JSON.parse(response);
            if (msgObj.method == "response" && msgObj.body) {
                buf = Buffer.from(msgObj.body);
                console.log("response");
                self.sendResponse(buf, res);
                self.requestResponseWS.removeListener("message", responseHandler);
            }
        } catch (err) {
            error("Message was not in JSON format");
        }
    }
    this.requestResponseWS.on("message", responseHandler);
};

ZerotiesServer.prototype.sendResponse = function(content, response){

   //todo: set headers
   response.end(content);
}


exports.ZerotiesServer = ZerotiesServer;


