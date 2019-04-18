let script = document.createElement('script');
console.log("injecting script")
if (chrome && chrome.extension) {
	script.src = chrome.extension.getURL('zeroties-browser-api.js');
} else if (browser && browser.extension) {
	script.src = browser.extension.getURL('zeroties-browser-api.js');
}

(document.head||document.documentElement).appendChild(script);