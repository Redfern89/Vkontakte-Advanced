// chrome.webRequest.onBeforeRequest.addListener(function(info) {
    // if (info.url.indexOf("notifier.js") + 1) {
		// return { redirectUrl: 'https://static.188918.ru/js/notifier.js?27042014' }
		// }
	
  // },
  // {urls: ["*://*.vk.me/*", "*://*.vk.com/*"], types: ["script"]},
  // ["blocking"]
// );

chrome.runtime.onMessage.addListener(function(msg, t, n) {
	if (msg.action == "download_file") {
		var JS = JSON.parse(msg.data);
		
		chrome.downloads.download({
			filename: JS[0].name,
			url: JS[0].url
			});
		}
	});