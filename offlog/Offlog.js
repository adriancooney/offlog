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