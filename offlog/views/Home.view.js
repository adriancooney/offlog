Offlog.registerView("Home", ["blogs"], function(view, data) {
	var blogs = new Offlog.List(data.blogs);

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

		Offlog.config("blog_context", id);

		Offlog.renderView("NewBlog", {editMode: true})
	});

	bindToMany(document.getElementsByClassName("delete-blog"), "click", function() {
		var that = this;
		Offlog.confirm("Are you sure you want to delete this blog?", function() {
			var id = that.parentNode.parentNode.getAttribute("data-blog");
			Offlog.config("blog_context", function(data) {
				var blog_context = data.blog_context
				if(blog_context == id) Offlog.config("rm", "blog_context");
				blogs.removeItemById(id);
				Offlog.config("blogs", blogs.toObject());

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