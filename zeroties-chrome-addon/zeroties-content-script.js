let script = document.createElement('script');
script.src = chrome.extension.getURL('zeroties-browser-api.js');
(document.head||document.documentElement).appendChild(script);