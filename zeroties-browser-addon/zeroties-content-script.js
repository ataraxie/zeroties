let script = document.createElement('script');
console.log("injecting script")
script.src = chrome.extension.getURL('zeroties-browser-api.js');
(document.head||document.documentElement).appendChild(script);