var Offlog = {
	containers: {
		sidebar: document.getElementById("sidebar-container"),
		main: document.getElementById("main-container")
	},

	views: {},

	sidebar: {
		buttonHandlers: {
			"Menu": function() {
				menuClick = true;

				//And wait
				setTimeout(function() {
					menuClick = false;

					if(!hoverIntentStillHovering) Offlog.sidebar.close()
				}, 2000);

				Offlog.sidebar.toggle();
			},

			"Home": function() {
				Offlog.renderView("Home");
			},

			"New Blog": function() {
				Offlog.renderView("NewBlog");
			},

			"Settings": function() {
				Offlog.renderView("Settings");
			},

			"Help": function() {
				Offlog.renderView("Help");
			},

			"New Post": function() {
				Offlog.renderView("NewPost");
			},

			"Edit Theme": function() {
				Offlog.renderView("EditTheme");
			},

			"View Drafts": function() {
				Offlog.renderView("Drafts");
			},
		},

		toggle: function() {
			var sb = Offlog.containers.sidebar.classList;
			if(sb.contains("small")) sb.remove("small");
			else sb.add("small");
		},

		close: function() {
			if(!Offlog.containers.sidebar.classList.contains("small")) Offlog.containers.sidebar.classList.add("small");
		},

		open: function() {
			if(Offlog.containers.sidebar.classList.contains("small")) Offlog.containers.sidebar.classList.remove("small");
		},

		status: function() {
			if(Offlog.containers.sidebar.classList.contains("small")) return "closed"
			else return "open";
		}
	},

	main: {
		/**
		 * Resize elements to full screen minus top bar
		 * @param  {object} ctx  View context
		 * @param  {object} e    Element to resize
		 * @param  {int} 	incr More or less removed/added
		 */
		resizeElement: function(ctx, e, incr) {
			//And resize
			e.style.height = (window.innerHeight - (47 + (incr || 0))) + "px";

			ctx.addEventListener(window, "resize", function() {
				e.style.height = (window.innerHeight - (47 + (incr || 0))) + "px";
			});
		}
	},

	resize: function() {
		document.body.style.height = window.innerHeight + "px";
	},

	init: function() {
		// Correct dimensions
		this.resize();

		this.renderView("Settings");
	},

	registerView: function(view, init, die) {
		this.views[view] = new Offlog.View(view, init, die);
	},

	renderView: function(view) {
		var that = this;
		if(!this.views[view]) console.log("View '" + view + "' not found.");
		else {
			if(this.currentView) this.views[this.currentView].die(), this.views[this.currentView].transition("fadeTop", "out", function() {
				that.views[view].render();
				that.views[view].transition("fadeTop", "in", function() {
					that.currentView = view;
				});
			}); else this.views[view].render(), this.currentView = view;
		}
	}
};

/**
 * Offlog View engine
 * @param {string} name Name of View
 * @param {function} init Constructor function
 * @param {function} die  Destroy function
 */
Offlog.View = function(name, init, die) {
	this.name = name;
	this._init = init;
	this._die = die || function() {};
	this.events = [];
};

Offlog.View.prototype.render = function() {
	this._init.call(this);
	this._bindEvents();
};

Offlog.View.prototype.die = function() {
	this._die.call(this);
	this._unbindEvents();
};

Offlog.View.prototype.addEventListener = function(elem, event, fn) {
	this.events.push([elem, event, fn]);
};

Offlog.View.prototype._bindEvents = function() {
	var that = this;
	this.events.forEach(function(eventObj) {
		eventObj[0].addEventListener(eventObj[1], function() {
			eventObj[2].call(that)
		});
	});
};

Offlog.View.prototype._unbindEvents = function() {
	this.events.forEach(function(eventObj) {
		eventObj[0].removeEventListener(eventObj[1], eventObj[2]);
	});
};

Offlog.View.prototype.transition = function(transition, inOrOut, callback) {
	if(inOrOut == "out") {
		Offlog.containers.main.classList.add("transition");
		setTimeout(function() {
			Offlog.containers.main.classList.add(transition);
			setTimeout(callback, 300);
		}, 50);
	} else {
		Offlog.containers.main.classList.add("transition");
		Offlog.containers.main.classList.add(transition);
		setTimeout(function() {
			Offlog.containers.main.classList.remove(transition);
			setTimeout(callback, 300);
		}, 50);
	}
};

/**
 * Offlog localStorage API. Simple stuff
 * @type {Object}
 */
Offlog.Storage = {
	"set": function(name, val) {
		window.localStorage.setItem(name, JSON.stringify(val));
	},

	"get": function(name) {
		if(this.exists(name)) {

			return JSON.parse(window.localStorage.getItem(name));

		} else throw new Error("Key does not exist");
	},

	exists: function(name) {
		return !!window.localStorage.key(name);
	}
};

Offlog.config = function(name, val) {
	name = "config_" + name;

	if(name && val) return Offlog.Storage.set(name, val);
	else return Offlog.Storage.get(name);
};

Offlog.Github = {
	auth: "basic",

	testCredentials: function(username, pw, callback) {
		var gb = new Github({
			username: username,
			password: pw,
			auth: Offlog.Github.auth
		}).getUser().show(username, this.callback(function(user) {
			callback(true);
		}, function(e) {
			if(e.error == 403 || e.error == 401) callback(false);
		}));
	},

	callback: function(clbk, error) {
		// Slick error handling baby, wildcard or manual
		var that = this;
		return function() {
			var args = Array.prototype.slice.call(arguments);
			if(args[0]) error ? error(args[0]) : that.error(args[0]);
			else clbk(args.slice(1));
		}
	},

	error: function(e) {

	}
};

/**
 * Offlog Templating engine (uses Mustache)
 * @type {Object}
 */
Offlog.Template = {
	templates: (function() {
		var templates = {};

		Array.prototype.forEach.call(document.querySelectorAll("script[data-id]"), function(e, i) {
			var id = e.getAttribute("data-id"),
				partials = (e.getAttribute("data-partials") || "").split(",").map(function(v) { return v.trim(); });

			templates[id] = [e.innerText.trim(), partials];
		});

		return templates;
	})(),

	render: function(template, where, data) {
		var templateArr = this.templates[template],
			partials = (templateArr[1].length > 0 && templateArr[1][0] !== "") ? (function() {
				var part = {};
				templateArr[1].forEach(function(name) {
					console.log("Partial name: ", name)
					part[name] = Offlog.Template.templates[name][0];
				});

				return part;
			})() : [];

			console.log(partials);
		var templateData = Mustache.render(templateArr[0], data, partials);

		where.setAttribute("data-template", template);
		where.innerHTML = templateData;
	}
};

/**
 * Offlog Notifications system
 * @param {string} type    Notification type; error, 
 * @param {string} title   Title of notification
 * @param {string} content Small description on notification
 * @param {integer} die    Length of time before notification fades
 */		
Offlog.Notification = function(type, title, content, die) {
	this.type = type || "notification";
	this.title = title || "Notification";
	this.content = content;
	this.die = die || 3000;
	this.icons = {
		"success": "ok",
		"error": "remove",
		"notification": "bolt"
	}

	var elem = this.elem = document.createElement("figure");

	elem.classList.add("notification");
	elem.classList.add(type);

	elem.innerHTML = "<i class=\"icon-remove-sign close\"></i><i class=\"icon-" + this.icons[type] + " type\"></i><h3>" + this.title + "</h3><p>" + this.content + "</p>";

	//Compensate for the possibilites of other notifications
	elem.style.bottom = ((document.querySelectorAll(".notification").length * (46 + 12)) + 12) + "px";

	var that = this;

	//Add close listener
	elem.querySelectorAll(".close")[0].addEventListener("click", function() {
		that.fadeOut();
	});

	document.body.appendChild(elem);

	//And animate
	this.fadeIn();
	setTimeout(function() {
		that.fadeOut();
	}, this.die);
};

Offlog.Notification.prototype.fadeIn = function() {
	var that = this;
	//Fade in with CSS Transition
	setTimeout(function() {
		that.elem.classList.add("active");
	}, 30);
};

Offlog.Notification.prototype.fadeOut = function() {
	//Fade out
	this.elem.classList.remove("active");

	var that = this;
	setTimeout(function() {
		document.body.removeChild(that.elem);
	}, 300);
};

Offlog.Modal = function(content, width, height) {
	width = width || 400;
	height = height || 320;

	this.overlay = document.createElement("div");
	this.overlay.classList.add("modal");

	this.overlay.style.height = window.innerHeight + "px";

	var modal = document.createElement("div"),
		iframe = document.createElement("iframe");

	modal.style.height = height + "px";
	modal.style.width = width + "px";

	this.overlay.appendChild(modal);
	modal.innerHTML = content;
	document.body.insertBefore(this.overlay, document.body.children[0]);

	modal.style.marginTop = ((window.innerHeight/2) - (height/2)) + "px";

	// Bind the onresize event
	var that = this;
	window.addEventListener("resize", function() {
		that.overlay.style.height = window.innerHeight + "px";
		modal.style.marginTop = ((window.innerHeight/2) - (height/2)) + "px";
	});

};

Offlog.Modal.prototype.die = function() {
	document.body.removeChild(this.overlay);
};

Offlog.Filesystem = {
	/*fs: (function() {
		webkitStorageInfo.requestQuota(window.PERSISTENT, 1024 * 1024, function(availableBytes) {
				console.log(availableBytes);
				window.webkitRequestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function(tfs) {
					console.log(tfs)
					Offlog.Filesystem.fs = tfs;
				});
		 	}
		);
	})(),*/

	moveContext: function() {
		chrome.fileSystem.chooseEntry({ type: 'openFile' }, function() { console.log(arguments); });
	},

	errorHandler: function(E) {
		new Offlog.Notification("error", "Filesystem Error", "Cannot access filesystem API.", 3000);
		console.log(E);
	},

	newFile: function(name, callback) {
		Offlog.Filesystem.fs.root.getFile(name, {create: true, exclusive: true}, callback, Offlog.Filesystem.errorHandler);
	},

	readDirectory: function(callback) {
		var dir = Offlog.Filesystem.fs.root.createReader();

		dir.readEntries(callback);
	}
};

/* Event Handling */
window.addEventListener("DOMContentLoaded", function() { Offlog.init() });
window.addEventListener("resize", function() { Offlog.resize() });
Array.prototype.forEach.call(document.querySelectorAll("nav li"), function(elem) {
	elem.addEventListener("click", function() {
		//Reset the hover intent
		hoverIntentListening = false;

		console.log(this.children[1].innerText.trim());
		Offlog.sidebar.buttonHandlers[this.children[1].innerText.trim()].call(Offlog, elem);
		if(!menuClick) setTimeout(Offlog.sidebar.close, 600);
	});
});

// Hover intent to expand menu on hover
var hoverIntentListening = false, hoverIntentStillHovering = false, menuClick = false;
Offlog.containers.sidebar.addEventListener("mouseover", function() {
	if(!hoverIntentListening && Offlog.sidebar.status() == "closed") {
		hoverIntentListening = true, hoverIntentStillHovering = true;
		setTimeout(function() {
			if(hoverIntentStillHovering) {
				Offlog.sidebar.open();
				hoverIntentListening = false;
			}
		}, 1500);
	}
});

Offlog.containers.sidebar.addEventListener("mouseout", function(event) {

    function hasParent(child, parent) {
    	for(var el = child.parentNode || false; el; el = (el || {}).parentNode) { //Pretty cool if I don't say so myself
    		if(el == parent) return true;
    	}
    }

    //Prevent firing if child node
	var e = event.toElement || event.relatedTarget; //Thanks SO
	if (e == this || hasParent(e, this)) {
        return;
    }

	hoverIntentStillHovering = false;

	//Close it anyway
	if(!menuClick) Offlog.sidebar.close();
});