chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
	width: 1020,
	height: 780
  });
});