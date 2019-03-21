let services = [];

let port = chrome.extension.connect({
	name: "Sample Communication"
});

function updateUi() {
	let $servicesList = $('#zeroties-services');
	$servicesList.html('');
	$.each(services, function(index, service) {
		$servicesList.append(`<li><a href="${service.address}">${service.name}</a></li>`)
	});
}

port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msgJson) {
	services = JSON.parse(msgJson);
	updateUi();
});