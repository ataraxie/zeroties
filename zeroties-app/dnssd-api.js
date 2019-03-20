const dnssd = require("dnssd");

function advertise(name, address, callback) {
	setTimeout(function() {
		callback({
			status: 200
		});
	}, 500);
}

function getServices(callback) {
	setTimeout(function() {
		callback({
			status: 200,
			services: [{ name: "MyService", address: "http://localhost:3000" }]
		});
	}, 2000);
}

exports.dnssdapi = {
	advertise,
	getServices
};
