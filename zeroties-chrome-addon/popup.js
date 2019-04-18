let services = [];

let port = chrome.extension.connect({
	name: "Sample Communication"
});

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
	chrome.tabs.update({url: $(this).attr('href')});
	window.close();
});
