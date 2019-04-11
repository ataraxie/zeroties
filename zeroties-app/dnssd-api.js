const dnssd = require('dnssd');

ads = {};

function stopAdvertising(name, address) {
	try{
		ads[name + address].stop(false);
	} catch (err) {
		error("stop error: service not found")
	}
}

function advertise(name, address, callback) {
	var options = {};
	options.name = name;
	//options.host = address;
	ads[name + address] = new dnssd.Advertisement(dnssd.tcp('http'), 4321, options);
	ads[name + address].start();
	callback({status: 200})
}

const browser = new dnssd.Browser(dnssd.tcp('http')).start();

function getServices(callback) {
	response = {};
	list = browser.list();
	let services = [];
	for(let item of list){
        let service = {
            serviceUrl: item.addresses[0] + ":9090",
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
