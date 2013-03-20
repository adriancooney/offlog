chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
	'width': 960,
	'height': 800
  });
});