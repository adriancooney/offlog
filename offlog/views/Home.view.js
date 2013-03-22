Offlog.registerView("Home", function() {
	Offlog.Template.render("home", Offlog.containers.main, {
		blogs: Offlog.config("blogs") || [],
		"description_formatted": function() {
			if(!this.description) return "No description."
			else return this.description;
		},

		"date": function() {
			return 1;
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

	Offlog.Console.append("")
});