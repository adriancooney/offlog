var gh = {
	request: function(obj, callback) {
		function e(m) { throw new Error(m) };

		// Sanitize the object first
		url = obj.url || e("No URL supplied to request");
		dataType = obj.dataType.toLowerCase() || "JSON"; // Let's be realistic, it's mostly JSON
		method = obj.method || "GET";
		data = obj.data || {};
		callback = (dataType == "jsonp") ? function() {} : (callback || e("Please provide a callback."));

		var httpRequest = new XMLHttpRequest();

		httpRequest.onreadystatechange = function(data) {
			if(httpRequest.readyState == 4) {
				//Data recieved
				var res = httpRequest.responseText;

				switch( dataType ) {
					case "json":
						res = JSON.parse(res);
					break;

					case "jsonp":
						if(!obj.jsonpCallback) e("Please provide a jsonp callback name");

						var script = document.createElement("script");
						script.innerText = res;

						//Timeout and remove
						setTimeout(function() {
							document.body.removeChild(script);
						}, 300);
					break;
				}

				callback(res);
			}
		};

		httpRequest.open(method, url, true);
		if(method.toLowerCase() == "post") httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.send(data);
	},

	modal: function(url) {
		var overlay = document.createElement("div");
		overlay.classList.add("modal");

		overlay.style.height = window.innerHeight + "px";

		var modal = document.createElement("div"),
			iframe = document.createElement("iframe");


		overlay.appendChild(modal);
		modal.appendChild(iframe);
		iframe.src = "";
		document.body.insertBefore(overlay, document.body.children[0]);

		modal.style.marginTop = ((window.innerHeight/2) - (320/2)) + "px";

		// Bind the onresize event
		window.addEventListener("resize", function() {
			overlay.style.height = window.innerHeight + "px";
			modal.style.marginTop = ((window.innerHeight/2) - (320/2)) + "px";
		});

	},

	init: (function() {
		window.addEventListener("DOMContentLoaded", function() {
			var modalStyle = 
				".modal {" +
					"position: fixed;" +
					"background: rgba(0,0,0,0.5);" +
					"z-index: 30;" +
					"width: 100%;" +
					"margin: 0;" +
				"}" +
				".modal div {" +
					"width: 400px;" +
					"height: 320px;" +
					"margin-left: auto;" +
					"margin-right: auto;" +
					"margin-top: 30%;" +
					"background: #fff;" + 
					"border: 12px solid rgba(0,0,0,0.6);" +
				"}" +
				".modal div iframe {" +
					"width: inherit;" +
					"height: inherit;" +
					"border: none;" +
				"}";

			// Append the style
			var style = document.createElement("style");
			style.setAttribute("type", "text/css");
			style.innerText = modalStyle;

			document.getElementsByTagName("head")[0].appendChild(style);
		});
	})()
};