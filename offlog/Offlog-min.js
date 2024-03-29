var Offlog = {
	containers: {
		sidebar: document.getElementById("sidebar-container"),
		main: document.getElementById("main-container")
	},

	defaultView: "NewPost",

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

			"Articles": function() {
				Offlog.renderView("Articles");
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

		//Initilize some variables
		Offlog.Storage.setIfNotExists("drafts", new Offlog.List);
		Offlog.Storage.setIfNotExists("blogs", new Offlog.List);
		Offlog.Storage.setIfNotExists("writing", {
				fontSize: "16px",
				lineHeight: "120%",
				font: "monospace"
			});

		//Render the default view
		//this.renderView(this.defaultView);
		
		//Check if the welcome has been shown, if not, show it
		Offlog.Storage.get("shownWelcome", function(store) {
			var sw = store.shownWelcome;

			if(!sw) {
				Offlog.renderView("Welcome");

				Offlog.Storage.set("shownWelcome", true);
			} else {
				Offlog.renderView(Offlog.defaultView);
			}
		})
	},

	confirm: function(msg, confrm, cancel) {
		var HTML = "<article class=\"confirm\"><i class=\"icon-question-sign\"></i><h4>" + msg + "</h4><p><button id=\"confirm\">Confirm</button><button id=\"cancel\">Cancel</button></p></article>";

		var modal = new Offlog.Modal(HTML, 400, 240);

		document.getElementById("confirm").addEventListener("click", function() {
			confrm();

			modal.die();
		});

		document.getElementById("cancel").addEventListener("click", function() {
			if(cancel) cancel();

			modal.die();
		});

	},

	working: function(bool) {
		if(bool) document.getElementById("working").classList.remove("inactive")
		else document.getElementById("working").classList.add("inactive");
	},

	registerView: function(view, init, die) {
		this.views[view] = new Offlog.View(view, init, die);
	},

	renderView: function(view, data) {
		var that = this;
		if(!this.views[view]) console.log("View '" + view + "' not found.");
		else {
			if(this.currentView) this.views[this.currentView].die(), this.views[this.currentView].transition("fadeTop", "out", function() {
				that.views[view].render(data);
				that.views[view].transition("fadeTop", "in", function() {
					that.currentView = view;
				});
			}); else this.views[view].render(data), this.currentView = view;
		}
	}
};

/* Event Handling */
window.addEventListener("DOMContentLoaded", function() { Offlog.init() });
window.addEventListener("resize", function() { Offlog.resize() });
Array.prototype.forEach.call(document.querySelectorAll("nav li"), function(elem) {
	elem.addEventListener("click", function() {
		//Reset the hover intent
		hoverIntentListening = false;

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
	hoverIntentStillHovering = false;

	//Close it anyway
	if(!menuClick) Offlog.sidebar.close();
});

//Keyboard shortcut, brought ot you by the beautfiul keymaster
key("command+h, ctrl+h", function() { Offlog.renderView("Home"); });
key("command+1, ctrl+1", function() { Offlog.renderView("NewPost"); });
key("command+2, ctrl+2", function() { Offlog.renderView("Articles"); });
key("command+3, ctrl+3", function() { Offlog.renderView("EditTheme"); });

/**
 * Development
 */
var exampleTheme = "<html><head><title>{{blog_title}}</title><link href='http://fonts.googleapis.com/css?family=Open+Sans:400,600' rel='stylesheet' type='text/css'><style type=\"text/css\">body {font-family: 'Open Sans', sans-serif;}.wrapper {width: 580px;margin: 0 auto;}header {border-bottom: 2px solid rgba(0,0,0,0.3);}header nav {float: right;width: 160px;}header nav li {display: inline-block;margin: 8px 2px;padding: 4px 12px;background: rgba(0,0,0,0.8);}header nav li a {color: #fff;}article {border-bottom: 1px solid rgba(0,0,0,0.2);}article h1 {font-family: Georgia;font-weight: 100;font-style: italic;}article h1 span {display: block;float: right;width: 50px;font-family: georgia;font-size: 50px;text-align: center;margin-top: -12px;}article h1 span em {font-size: 14px;}article p {color: #444;}footer {text-align: center;color: rgba(0,0,0,0.6);font-size: 80%;}</style></head><body><div class=\"wrapper\"><header><h1>{{blog_title}}</h1></header>{{#article}}<article><h1><span>{{article_date}}<br><em>{{article_month}}</em></span>{{article_title}}</h1>{{article_content}}</article>{{/article}}<footer><p>&copy; {{date.year}} {{author_name}}</p></footer></div></body></html>";

/* **********************************************
     Begin Offlog.View.js
********************************************** */

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

Offlog.View.prototype.render = function(data) {

	var that = this;
	Offlog.Storage.get(undefined, function(vars) { //Expose all data to every view

		//Merge the view supplied data with storage vars
		if(data) for(var key in data) vars[key] = data[key];

		that._init.call(that, that, vars);
		that.bindEvents();
	})
};

Offlog.View.prototype.die = function() {
	this._die.call(this);
	this.unbindEvents();
};

Offlog.View.prototype.addEventListener = function(elem, event, fn) {
	this.events.push([elem, event, fn]);
};

Offlog.View.prototype.bindEvents = function() {
	var that = this;
	this.events.forEach(function(eventObj) {
		if(eventObj[0]) eventObj[0].addEventListener(eventObj[1], function() {
			eventObj[2].call(that)
		});
	});
};

Offlog.View.prototype.unbindEvents = function() {
	this.events.forEach(function(eventObj) {
		if(eventObj[0]) eventObj[0].removeEventListener(eventObj[1], eventObj[2]);
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

/* **********************************************
     Begin Offlog.Template.js
********************************************** */

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
					part[name] = Offlog.Template.templates[name][0];
				});

				return part;
			})() : [];

		var templateData = Mustache.render(templateArr[0], data, partials);

		where.setAttribute("data-template", template);
		where.innerHTML = templateData;
	}
};

/* **********************************************
     Begin Offlog.Storage.js
********************************************** */

Offlog.Storage = {
	api: chrome.storage.local,
	_prefix: "offlog_",
	store: {},

	prefix: function(o, f) {
		var that = this;
		if(o instanceof Array) o = o.map(function(v) { return f(v); });
		else if(o instanceof Object) { var n = {}; for(var key in o) n[f(key)] = o[key]; o = n; }
		else if(typeof o == "string") o = f(o); //Hrm, "" instanceof String == false

		return o;
	},

	addPrefix: function(obj) {
		var prefix = this._prefix;
		return this.prefix(obj, function(key) {
			return prefix + key;
		});
	},

	removePrefix: function(obj) {
		var prefix = this._prefix;
		return this.prefix(obj, function(key) {
			return key.replace(prefix, "");
		});
	},

	"get": function(name, callback) {
		var that = this,
			names = name; //that.addPrefix(name);
		this.api.get(names, function(data) {
			var obj = data; //that.removePrefix(data);

			//Loop through and run preprocessors
			for(var key in obj) {
				if(typeof obj[key] == "object" && obj[key].list) {
					obj[key] = new Offlog.List(obj[key]);
				}
			}

			callback(obj);
		});
	},

	"set": function(name, value, callback) {
		if(typeof value == "function") callback = value, value = undefined;

		//Storage only takes objects
		if(typeof name == "string" && value) {
			var c = {};
			c[name] = value;
			name = c;
		}

		//Loop over values
		for(var key in name) {
			if(name[key] instanceof Offlog.List) name[key] = name[key].toObject();
		}

		var names = name; //this.addPrefix(name);

		this.api.set(names, callback);
	},

	"remove": function(name, callback) {
		this.api.remove(name);
	},

	setIfNotExists: function(name, value, callback) {
		console.log("Setting if not exists");
		var that = this;
		this.get(name, function(store) {
			if(!store[name]) {
				console.log("Does not exist");
				that.set(name, value, callback);
			} else {
				console.log("Exists", name);
			}
		})
	}
};

/* **********************************************
     Begin Offlog.Notification.js
********************************************** */

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

/* **********************************************
     Begin Offlog.Modal.js
********************************************** */

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

/* **********************************************
     Begin Offlog.List.js
********************************************** */

/**
 * Database like list functionality with id's for objects
 * @param {object} list And existing list
 */
Offlog.List = function(list) {
	if(list && typeof list == "object") {
		// Existing list
		this.list = list.list;
		this.lastInsertId = list.lastInsertId;
	} else if(typeof list == "string") {
		var o = JSON.parse(list);
		// Existing list
		this.list = o.list;
		this.lastInsertId = o.lastInsertId;
	} else {
		// New list
		this.list = [];
		this.lastInsertId = 0;
	}

	this.__defineGetter__("length", function() {
		return this.list.length;
	});
};

Offlog.List.prototype.toJSON = function() {
	return JSON.stringify({
		list: this.list,
		lastInsertId: this.lastInsertId
	});
};

Offlog.List.prototype.toObject = function() {
	return {
		list: this.list,
		lastInsertId: this.lastInsertId
	};
};

Offlog.List.prototype.addItem = function(data) {
	this.lastInsertId++;
	data.id = this.lastInsertId;
	this.list.push(data);
	return data;
};

Offlog.List.prototype.updateItemById = function(id, data) {
	for(var i = 0; i < this.list.length; i++) if(this.list[i].id == id) {
		data.id = id;
		this.list[i] = data;
	}
};

Offlog.List.prototype.removeItemById = function(id) {
	for(var i = 0; i < this.list.length; i++) if(this.list[i].id == id) this.list.splice(i, 1);
};

Offlog.List.prototype.getItemById = function(id) {
	for(var i = 0; i < this.list.length; i++) if(this.list[i].id == id) return this.list[i];
};

/* **********************************************
     Begin Offlog.Github.js
********************************************** */

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
		// Error codes
		// HTTP 4XX
		// Custom Errors
		// 		1 -- Github not integrated

		switch( e ) {
			case 1:
				new Offlog.Notification("error", "Github not integrated", "Please visit the settings pane and login to Github.");
			break;
		}
	},

	// Singleton Class for the github API
	api: function(callback) {
		if(!this.gh) {
			var that = this;
			Offlog.Storage.get(["gh_integrated", "gh_username", "gh_password"], function(data) {
				if(data.gh_integrated)
					Offlog.gh = new Github({
						username: data.gh_username,
						password: Base64.decode(data.gh_password),
						auth: "basic"
					}), callback(Offlog.gh);
				else that.error(1);
			});
		} else callback(this.gh);
	},

	getAuthorInformation: function(clbk) {
		Offlog.Storage.get("gh_username", function(data) {
			var username = data.username;
			Offlog.Github.getUser(username, function(user) {
				user = user[0];

				Offlog.Storage.set("author", user);

				clbk();
			});
		});
	},

	getUser: function(username, callback) {
		Offlog.Github.api(function(api) {
			api.getUser().show(username, Offlog.Github.callback(callback));
		})
	}
};

/* **********************************************
     Begin Offlog.Filesystem.js
********************************************** */

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

/* **********************************************
     Begin Offlog.Blog.js
********************************************** */

/**
 * Offlog Blog class
 */
Offlog.Blog = function(data) {
	var defaults = {
		theme: "default",
		articles: [],
		timestamp: new Date().toJSON()
	};

	for(var key in defaults) if(!data[key]) data[key] = defaults[key];

	this.blog = data;
};

Offlog.Blog.prototype.compile = function() {
	var theme = this.getTheme(theme);

	//Right so, compilation
	//First off, we a need a config file for Offlog to allow users to switch 
	//between computers. Secondly, we need an index.html, and folders with their
	//own index.html for articles.
	

};

Offlog.Blog.prototype.compilePage = function(page, data) {
	switch( page ) {
		case "index":
			var page;

			//Index takes articles in short form
			console.log(this);
		break;

		case "article":

		break;
	}
};

Offlog.Blog.prototype.getTheme = function(theme) {
	return exampleTheme;
};

Offlog.Blog.prototype.save = function(callback) {
	var that = this;
	Offlog.Storage.get("blogs", function(data) {
		var id = data.blogs.addItem(that.blog)
		Offlog.Storage.set("blogs", data.blogs);
		callback(id.id);
	});
};

/* **********************************************
     Begin Offlog.Article.js
********************************************** */

/**
 * Offlog's article storage system
 * @param {string} title The title of the article
 * @param {string} text  The content of the article
 */
Offlog.Article = function(title, text) {
	this.article = {
		title: title,
		content: text,
		timestamp: new Date().toJSON(),
		published: false
	};
};

Offlog.Article.prototype.save = function(callback) {
	var that = this;
	Offlog.Storage.get("drafts", function(data) {
		var id = data.drafts.addItem(that.article)
		Offlog.Storage.set("drafts", data.drafts);

		callback(id.id);
	});
};

/* **********************************************
     Begin Help.view.js
********************************************** */

Offlog.registerView("Help", function() {
	console.log("REndering view Welcome");
	Offlog.Template.render("help", Offlog.containers.main);
});

/* **********************************************
     Begin Articles.view.js
********************************************** */

Offlog.registerView("Articles", function(view, data) {
	var drafts = data.drafts;

	Offlog.Template.render("articles", Offlog.containers.main, {
		drafts: drafts.list,

		"drafts_empty": function() {
			if(this.drafts.length == 0) return true;
			else return false;
		},

		"date": function() {
			//This is a really nice library, kudos
			//https://github.com/zachleat/Humane-Dates
			return humaneDate(this.timestamp);
		}
	});

	var draftsList = document.querySelectorAll(".articles-list li"),
		toolbar = document.getElementById("toolbar"),
		placeholder = document.querySelectorAll(".placeholder")[0];

	Array.prototype.forEach.call(draftsList, function(draft) {
		draft.addEventListener("click", function() {
			var id = parseInt(this.id.replace("article-", ""));

			displayDraft(drafts.getItemById(id));
		});
	});

	function displayArticle(article) {
		var title = "<h1>" + article.title + "</h1>",
			content = markdown.toHTML(article.content);

		placeholder.setAttribute("data-article", article.id);

		toolbar.classList.remove("inactive");

		placeholder.innerHTML = title + content;
	}

	this.addEventListener(document.getElementById("continue-editing-draft"), "click", function() {
		Offlog.Storage.set("current_draft", parseInt(placeholder.getAttribute("data-article")));

		Offlog.renderView("NewPost")
	})

	this.addEventListener(document.getElementById("delete-article"), "click", function() {

		Offlog.confirm("Are you sure you want to delete this article?", function() {
			var id = parseInt(placeholder.getAttribute("data-article"));

			Offlog.Storage.get("current_draft", function(data) {
				var current_draft = data.current_draft;
				if(current_draft == id) Offlog.Storage.remove("current_draft");
				drafts.removeItemById(id);
				Offlog.Storage.set("drafts", drafts.toObject());

				view.render();
			});
		});
		
	})

	Offlog.main.resizeElement(this, document.querySelectorAll(".preview")[0]);
});

/* **********************************************
     Begin Home.view.js
********************************************** */

Offlog.registerView("Home", function(view, data) {

	/** Publishing console **/
	Offlog.Console = {
		append: function(data) {
			var console = document.getElementById("console");

			var p = document.createElement("p");
			p.innerText = data;

			console.appendChild(p);

			//http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
			console.scrollTop = console.scrollHeight;
		},

		clear: function() {
			document.getElementById("console").innerHTML = "";
		}
	};

	var blogs = data.blogs;

	Offlog.Template.render("home", Offlog.containers.main, {
		blogs: blogs.list,
		"description_formatted": function() {
			if(!this.description) return "No description."
			else return this.description;
		},

		"date": function() {
			var d = new Date(this.timestamp);
			return d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
		},

		"article_count": function() {
			var count = 0;
			for(var i = 0; i < this.articles.length; i++) if(this.articles[i].published) count++;
			return count;
		},

		"draft_count": function() {
			var count = 0;
			for(var i = 0; i < this.articles.length; i++) if(!this.articles[i].published) count++;
			return count;
		},

		"blogs_empty": function() {
			if(this.blogs.length == 0) return true;
			else false;
		}
	});

	//Bind to those blog buttons
	bindToMany(document.getElementsByClassName("edit-blog-settings"), "click", function() {
		var id = this.parentNode.parentNode.getAttribute("data-blog");

		Offlog.Storage.set("blog_context", id);

		Offlog.renderView("NewBlog", {editMode: true})
	});

	bindToMany(document.getElementsByClassName("delete-blog"), "click", function() {
		var that = this;
		Offlog.confirm("Are you sure you want to delete this blog?", function() {
			var id = that.parentNode.parentNode.getAttribute("data-blog");
			Offlog.Storage.get("blog_context", function(data) {
				var blog_context = data.blog_context
				if(blog_context == id) Offlog.Storage.remove("blog_context");
				blogs.removeItemById(id);
				Offlog.Storage.set("blogs", blogs);

				view.render();
			});
		});
	});

	function bindToMany(nodes, event, callback) {
		Array.prototype.forEach.call(nodes, function(n) {
			n.addEventListener(event, callback);
		})
	}

	//Set the overflow height
	Offlog.main.resizeElement(this, document.querySelectorAll(".scroll-wrapper")[0]);

	var phraseCount = 0;
	this.addEventListener(document.getElementById("console"), "click", function() {
		// var phrases = ["Ouch!", "Stop poking me!", "Be patient.", "You know clicking me won't make it go faster", "Yet you keep trying", "How naive.", "Can you stop now?", "Hey, go do something productive while I'm working", "This is productive?", "You clicking a box..", "Stop.", "", "", "", "STOP IT.", "I'll report you", "You're not in the list of sudoers."];
		var lyrics = ["Now this is the story all about how",
				"My life got flipped, turned upside down",
				"And I'd like to take a minute just sit right there",
				"I'll tell you how I became the prince of a town called Bel-air",
				"In west Philadelphia born and raised",
				"On the playground where I spent most of my days",
				"Chilling out, maxing, relaxing all cool",
				"And all shooting some b-ball outside of the school",
				"When a couple of guys, they were up to no good",
				"Started making trouble in my neighbourhood",
				"I got in one little fight and my mom got scared",
				"And said \"You're moving with your auntie and uncle in Bel-air\"",
				"I whistled for a cab and when it came near the",
				"License plate said \"fresh\" and had a dice in the mirror",
				"If anything I could say that this cab was rare",
				"But I thought nah, forget it, yo homes to Bel-air!",
				"I pulled up to a house about seven or eight",
				"And I yelled to the cabby \"Yo, homes smell you later!\"",
				"Looked at my kingdom I was finally there",
				"To sit on my throne as the prince of Bel-air"];

		if(lyrics[phraseCount]) Offlog.Console.append(lyrics[phraseCount]), phraseCount++;
	});

	Offlog.Console.append("");
});

/* **********************************************
     Begin Welcome.view.js
********************************************** */

Offlog.registerView("Welcome", function() {
	console.log("REndering view Welcome");
	Offlog.Template.render("welcome", Offlog.containers.main);
}, function() {
	console.log("Die!");
});

/* **********************************************
     Begin EditTheme.view.js
********************************************** */

Offlog.registerView("EditTheme", function() {
	Offlog.Template.render("edit-theme", Offlog.containers.main);

	var cm = document.getElementById("codemirror");

	var myCodeMirror = CodeMirror(cm, {
		value: "function myScript(){return 100;}\n",
		mode: "javascript",
		lineNumbers: "true",
		theme: "elegant"
	});

	var editing = document.querySelectorAll(".editing")[0];
	Offlog.main.resizeElement(this, editing);

	//Preety damn hacky but whatevs
	editing.style.width = (window.innerWidth - Offlog.containers.sidebar.clientWidth) + "px";

	var dragging = false, startXPos;
	var grab = document.getElementById("grab");

	grab.addEventListener("mousedown", function() {
		dragging = true;
	});

	var max = cm.clientWidth, min = window.innerWidth - (Offlog.containers.sidebar.clientWidth + 980);

	console.log(max);
	window.addEventListener("mousemove", function(e) {
		e.preventDefault();

		var x = e.clientX - Offlog.containers.sidebar.clientWidth,
			pos = (x >= max) ? max : ((x <= min) ? min : x);

		if(dragging == true) document.querySelectorAll(".expandable")[0].style.marginLeft = pos + "px";
		return false;
	}, true);

	grab.addEventListener("mouseup", function() {
		dragging = false;
	});
});

/* **********************************************
     Begin NewBlog.view.js
********************************************** */

Offlog.registerView("NewBlog", function(view, data) {
	var editMode = (data) ? data.editMode : false,
		blogs = data.blogs,
		blog_context = data.blog_context;


	Offlog.Template.render("new-blog", Offlog.containers.main, {
		action: editMode ? "Update" : "New",
		blog: (editMode && blog_context) ? blogs.getItemById(blog_context) : {},
		button: editMode ? "Update" : "Submit"
	});

	this.addEventListener(document.getElementById("action-newblog"), "click", function(e) {
		var form = document.getElementById("create-blog"),
			inputs = form.querySelectorAll("input[type=text], textarea, select"),
			required = ["name", "theme", "root_location"],
			aliases = {
				"root_location": "Root Location",
				"name": "Blog Name"
			}, values = {};

		for(var i = 0; i < inputs.length; i++) {
			var input = inputs[i], inputName = input.getAttribute("name");

			if(required.indexOf(inputName) !== -1 && input.value == "") return new Offlog.Notification("error", "New Blog Error", "Please fill out the '" + aliases[inputName] + "' field."); 
			
			values[inputName] = input.value;
		}

		//Check to see if the root location is unique
		var blogsArr = blogs.list || [];
		for(var i = 0; i < blogsArr.length; i++) if(blogsArr[i].root_location == values["root_location"]) return new Offlog.Notification("error", "Root location not unique", "That root location is already in use on blog '" + blogs[i].title + "'.");

		if(!editMode) {
			//Inputs sanitized
			var blog =  new Offlog.Blog({
				title: values["name"],
				theme: values["theme"],
				root_location: values["root_location"],
				description: values["description"]
			})

			var id = blog.save(function(id) {

				//Set it as the current blog
				Offlog.Storage.set("blog_context", id);
			});

			new Offlog.Notification("success", "Successfully created blog", "Successfully created blog '" + values["name"] + "'");

		} else {
			var blog = blogs.getItemById(blog_context);

			blog.title = values["name"];
			blog.theme = values["theme"];
			blog.root_location = values["root_location"];
			blog.description = values["description"];

			blogs.updateItemById(blog.id, blog);

			new Offlog.Notification("success", "Successfully updated blog", "Successfully updated blog '" + values["name"] + "'");

		}

		Offlog.renderView("Home");
	})
});

/* **********************************************
     Begin Settings.view.js
********************************************** */

Offlog.registerView("Settings", function(view, data) {
	var gh_integration = data.gh_integration,
		author = data.author;


	var notIntegrated = "<h4 class=\"integrated not\"><i class=\"icon-warning-sign\"></i> Github not integrated.</h4>";
	var isIntegrated = "<h4 class=\"integrated\"><i class=\"icon-ok\"></i> Github integrated.</h4>";
	var actionIntegrate = "<h5 class=\"github-button\" id=\"github-signin\"><i class=\"icon-github\"></i><span>Github Login</span></h5>";
	var actionDeauthorize = "<h5 class=\"github-button\" id=\"github-deauthorize\"><i class=\"icon-github\"></i><span>Remove Account</span></h5>";


	Offlog.Template.render("settings", Offlog.containers.main, {
		"author": author,
		"integration_text": gh_integration ? isIntegrated : notIntegrated,
		"integration_disabled": gh_integration ? "disabled" : "",
		"integration_actions": gh_integration ? actionDeauthorize : actionIntegrate,
		"writing": data.writing
	});

	this.addEventListener(document.getElementById("github-deauthorize"), "click", function() {
		// De authorize the user
		Offlog.Storage.remove(["gh_integration", "gh_password", "gh_username", "author"]);

		view.render();
		new Offlog.Notification("success", "Github Deauthorized", "Github account deauthorized successfully.");
	});

	this.addEventListener(document.getElementById("github-signin"), "click", function() {
		view.render();
		var modal = new Offlog.Modal(Mustache.render(Offlog.Template.templates["github-login"][0]), 400, 340);

		// Bind the events to the buttons
		document.getElementById("cancel-login").addEventListener("click", function() {
			modal.die();
		});

		document.getElementById("submit-login").addEventListener("click", function() {

			var username = document.getElementById("login-username").value,
				password = document.getElementById("login-password").value;

			if(username && password) {
				showLoader();

				Offlog.Github.testCredentials(username, password, function(valid) {
					hideLoader();

					if(valid) {
						new Offlog.Notification("success", "Valid Credentials", "Your Github credentials are valid.");
						modal.die();

						//And set the user information
						Offlog.Storage.set("gh_integration", true);
						Offlog.Storage.set("gh_username", username);

						// Not a fan of this but impossible to travel between sessions without it
						Offlog.Storage.set("gh_password", Base64.encode(password));

						//Set the user information
						Offlog.Github.getAuthorInformation(function(user) {
							view.render();
						});
					} else new Offlog.Notification("error", "Invalid Credentials", "Please provide valid Github credentials.");
				})
			} else {
				new Offlog.Notification("error", "Credentials", "Please provide a username and password.")
			}
		});

		function showLoader() {
			document.getElementById("load").classList.remove("inactive");
		}

		function hideLoader() {
			document.getElementById("load").classList.add("inactive");
		}
	});

	Array.prototype.forEach.call(document.querySelectorAll("input[type=text], textarea"), function(input) {
		input.addEventListener("keydown", function(key) {
			console.log(key);
			if(key.which == 13 || key.which == 9 && !key.shiftKey) {
				if(key.which !== 9) key.preventDefault();

				var input = this.getAttribute("name").split("-"),
					that = this;

				Offlog.Storage.get(input[0], function(data) {
					var obj = data[input[0]] || {};

					obj[input[1]] = that.value;

					console.log(that.value)

					var save = {};
					save[input[0]] = obj;

					Offlog.Storage.set(save);

					new Offlog.Notification("success", "Information saved", "Information successfully saved.");
				});
			}
		})
	});
});

/* **********************************************
     Begin NewPost.view.js
********************************************** */

Offlog.registerView("NewPost", function(view, storage) {

	var blogs = storage.blogs,
		drafts = storage.drafts,
		blog_context = storage.blog_context,
		current_draft = storage.current_draft;

	Offlog.Template.render("new-post", Offlog.containers.main, {
		"blog_context": function() {

			if(blog_context) {
				return blogs.getItemById(blog_context).title;
			} else {
				return "No blog selected."
			}
		},

		"has_many_blogs": function() {
			if((blogs || []).length > 1) return true;
			else return false;
		},

		"draft_content": function() {
			if(current_draft) {
				return drafts.getItemById(current_draft).content;
			}
		},

		"draft_title": function() {
			if(current_draft) {
				return drafts.getItemById(current_draft).title;
			}
		},

		"writing": storage.writing
	});

	this.addEventListener(document.getElementById("post-new"), "click", function() {
		Offlog.Storage.remove("current_draft");

		view.render();
	});

	this.addEventListener(document.getElementById("post-save"), "click", function() {
		//Check to see if there's a title
		var title = document.getElementById("new-post-title").value,
			content = document.getElementById("new-post-content").value;

		Offlog.Storage.get("current_draft", function(storage) {
			if(!storage.current_draft) {
				//create a new article instance
				if(!title) return new Offlog.Notification("error", "No Title", "Please supply a title before saving");

				var article = new Offlog.Article(title, content);
				article.save(function(id) {
					Offlog.Storage.set("current_draft", id);
				});

			} else {
				Offlog.Storage.get(["drafts", "current_draft"], function(storage) {
					var drafts = storage.drafts;
					var article = drafts.getItemById(storage.current_draft);

					article.title = title;
					article.content = content;
					article.timestamp = (new Date()).toJSON();

					drafts.updateItemById(article.id, article);
					Offlog.Storage.set("drafts", drafts);
				});
			}
		});
		
		return new Offlog.Notification("success", "Draft saved", "Draft successfully saved.");
	})

	Offlog.main.resizeElement(this, document.getElementById("new-post-content"), 70);
});