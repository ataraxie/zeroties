const dnssd = require('dnssd');

ads = {};
services = {};

function stopAdvertising(name) {
	try{
		ads[name].stop(false);
	} catch (err) {
		console.error("stop error: service not found")
	}
}

function advertise(name, addressObj, callback) {
	var options = {};
	options.name = name;
	//options.host = address;
	ads[name] = new dnssd.Advertisement(dnssd.tcp('http'), addressObj.port, options);
	ads[name].start();
	ads[name].on("error", (e) => {console.error(e); ads[name].stop()});
	callback({status: 200})
}

var browser = new dnssd.Browser(dnssd.tcp('http'));
browser.on('serviceUp', function(service) {
    services[service.name] = service;
});
browser.on('serviceDown', function(service){
    delete services[service.name];
});

browser.start();

function getServices(callback) {
	let response = {};
	//list = browser.list();
	//console.log(list);
	let serviceList = [];
	for(let item of Object.values(services)){
		let url = item.addresses[0];
        let service = {
            serviceUrl:  url + ":" + item.port,
            serviceName: item.name
        }
        serviceList.push(service);
    }
    response.services = serviceList;
    response.status = 200;
	callback(response);
}

exports.dnssdapi = {
	advertise,
	getServices,
	stopAdvertising
};
