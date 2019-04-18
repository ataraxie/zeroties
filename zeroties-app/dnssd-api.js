const dnssd = require('dnssd');

ads = {};

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
	callback({status: 200})
}

const browser = new dnssd.Browser(dnssd.tcp('http')).start();

function getServices(callback) {
	response = {};
	list = browser.list();
	//console.log(list);
	let services = [];
	for(let item of list){
        let service = {
            serviceUrl: item.addresses[0] + ":" + item.port, //TODO: fix this
            serviceName: item.name
        }
        services.push(service);
    }
    response.services = services;
    response.status = 200;
	callback(response);
}

exports.dnssdapi = {
	advertise,
	getServices,
	stopAdvertising
};
