
let script2 = document.createElement('script');
console.log("injecting script")
script2.src = chrome.extension.getURL('socket.io.js');
(document.head||document.documentElement).appendChild(script2);

let script = document.createElement('script');
console.log("injecting script")
script.src = chrome.extension.getURL('zeroties-browser-api.js');
(document.head||document.documentElement).appendChild(script);

