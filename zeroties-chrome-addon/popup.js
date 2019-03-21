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


function clickHandler(e) {
	chrome.tabs.update({url: "https://example.com"});
	window.close(); // Note: window.close(), not this.close()
}

$('#zeroties-services').on("click", "a", function() {
	chrome.tabs.update({url: $(this).attr('href')});
	window.close();
});
