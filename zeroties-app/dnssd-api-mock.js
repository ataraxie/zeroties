const dnssd = require("dnssd");

let count = 0;

function advertise(name, address, callback) {
	setTimeout(function() {
		callback({
			status: 200
		});
	}, 500);
}

function getServices(callback) {
	var name = "MyService";
	setTimeout(function() {
		count += 1;
		if (count % 3 === 0) {
			name += count;
		}
		callback({
			status: 200,
			services: [{ name: name, address: "http://localhost:3000" }]
		});
	}, 2000);
}

exports.dnssdapi = {
	advertise,
	getServices
};
