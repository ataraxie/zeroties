const dnssd = require("dnssd");

let mockServices = [
	{ name: "Youtube", address: "http://www.youtube.com" },
	{ name: "Facebook", address: "http://www.facebook.com" },
	{ name: "Baidu", address: "http://www.baidu.com" },
	{ name: "Yahoo", address: "http://www.yahoo.com" },
	{ name: "Amazon", address: "http://www.amazon.com" },
	{ name: "Wikipedia", address: "http://www.wikipedia.org" },
	{ name: "QQ", address: "http://www.qq.com" },
	{ name: "Google.co", address: "http://www.google.co.in" },
	{ name: "Twitter", address: "http://www.twitter.com" },
	{ name: "Live", address: "http://www.live.com" },
	{ name: "Taobao", address: "http://www.taobao.com" },
	{ name: "Bing", address: "http://www.bing.com" },
	{ name: "Instagram", address: "http://www.instagram.com" },
	{ name: "Weibo", address: "http://www.weibo.com" },
	{ name: "Sina", address: "http://www.sina.com.cn" },
	{ name: "Linkedin", address: "http://www.linkedin.com" },
	{ name: "Yahoo.co", address: "http://www.yahoo.co.jp" },
	{ name: "MSN", address: "http://www.msn.com" },
	{ name: "VK", address: "http://www.vk.com" },
	{ name: "Google.de", address: "http://www.google.de" },
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
