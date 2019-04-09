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
	//options.name = name;
	//options.host = address;
	ads[name + address] = new dnssd.Advertisement(dnssd.tcp('http'), 4321, options);
	ads[name + address].start();
	response.status = 200;
	callback(response)
}

const browser = new dnssd.Browser(dnssd.tcp('http')).start();

function getServices(callback) {
	response = {};
	response.services = browser.list();
	response.status = 200;
	callback(response);
}

exports.dnssdapi = {
	advertise,
	getServices
};
