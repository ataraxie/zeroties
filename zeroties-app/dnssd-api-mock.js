const dnssd = require("dnssd");

let mockServices = [
	{ name: "Tyree", address: "http://54.35.98.230" },
	{ name: "Ester", address: "http://58.165.28.93" },
	{ name: "Carole", address: "http://159.61.195.1" },
	{ name: "Ray", address: "http://100.228.141.26" },
	{ name: "Cordie", address: "http://117.45.200.195" },
	{ name: "Leonora", address: "http://91.169.139.142" },
	{ name: "Liane", address: "http://196.170.245.221" },
	{ name: "Adelle", address: "http://219.103.57.237" },
	{ name: "Harley", address: "http://136.85.113.192" },
	{ name: "Hipolito", address: "http://217.19.9.255" },
	{ name: "Marshall", address: "http://156.90.33.5" },
	{ name: "Mariel", address: "http://127.133.69.199" },
	{ name: "Thanh", address: "http://234.248.65.245" },
	{ name: "Bruna", address: "http://68.245.43.114" },
	{ name: "Lili", address: "http://112.212.241.124" },
	{ name: "Jannie", address: "http://139.145.38.23" },
	{ name: "Ludivina", address: "http://6.236.94.8" },
	{ name: "Venessa", address: "http://157.97.141.85" },
	{ name: "Mardell", address: "http://184.190.114.8" },
	{ name: "Amparo", address: "http://200.72.159.93" }
];

let mock = [
	{
		wait: 3000,
		services: [0, 1, 2, 3]
	},
	{
		wait: 5000,
		services: [1, 2, 3]
	},
	{
		wait: 4000,
		services: [1, 2, 3, 4, 5]
	},
	{
		wait: 2000,
		services: [3, 4, 5, 6, 7, 8]
	},
	{
		wait: 5000,
		services: [11, 10, 9, 8]
	}
];

let services = [];

function advertise(name, address, callback) {
	setTimeout(function() {
		callback({
			status: 200
		});
	}, 500);
}

function getServices(callback) {
	callback({
		status: 200,
		services: services
	});
}

function runMocks() {
	var index = 0;
	var runNextMock = function() {
		var currentMock = mock[index];
		var newServices = [];
		for (let serviceIndex of currentMock.services) {
			newServices.push(mockServices[serviceIndex]);
		}
		services = newServices;
		index++;
		if (index >= mock.length) {
			index = 0;
		}
		setTimeout(runNextMock, currentMock.wait);
	};
	runNextMock();
}

runMocks();

exports.dnssdapi = {
	advertise,
	getServices
};
