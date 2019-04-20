let services = [];

let zerotiesChannel = {
	name: "Zeroties browser addon channel"
};

let port = null;
if (chrome && chrome.extension && chrome.extension.connect) {
	port = chrome.extension.connect(zerotiesChannel);
} else if (browser && browser.runtime) {
	port = browser.runtime.connect(zerotiesChannel);
}

function updateUi() {
	let $servicesList = $('#zeroties-services');
	$servicesList.html('');
	$.each(services, function(index, service) {
		console.log(service);
		$servicesList.append(`<li><a href="http://${service.serviceUrl}">${service.serviceName}</a></li>`)
	});
}

port.onMessage.addListener(function(msgJson) {
	services = JSON.parse(msgJson);
	updateUi();
});

$('#zeroties-services').on("click", "a", function() {
	var updateObject = {url: $(this).attr('href')};
	if (chrome) {
		chrome.tabs.create(updateObject);
	} else if (browser) {
		browser.tabs.create(updateObject);
	}
});
