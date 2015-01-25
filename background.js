chrome.runtime.onMessage.addListener(function(msg, t, n) {
	if (msg.action == "download_file") {
		var JS = JSON.parse(msg.data);
		
		chrome.downloads.download({
			filename: JS[0].name,
			url: JS[0].url
			});
		}
	});