Offlog.registerView("NewPost", function(view) {
	Offlog.Template.render("new-post", Offlog.containers.main, {
		"blog_context": function() {
			var context = Offlog.config("blog_context");

			if(context) {
				return Offlog.config("blogs")[context - 1].title;
			} else {
				return "No Blogs."
			}
		},

		"has_many_blogs": function() {
			if((Offlog.config("blogs") || []).length > 1) return true;
			else return false;
		},

		"draft_content": function() {
			if(Offlog.config("current_draft")) {
				return (new Offlog.List(Offlog.config("drafts"))).getItemById(Offlog.config("current_draft")).content;
			}
		},

		"draft_title": function() {
			if(Offlog.config("current_draft")) {
				return (new Offlog.List(Offlog.config("drafts"))).getItemById(Offlog.config("current_draft")).title;
			}
		}
	});

	this.addEventListener(document.getElementById("post-new"), "click", function() {
		Offlog.config("rm", "current_draft");

		view.render();
	});

	this.addEventListener(document.getElementById("post-save"), "click", function() {
		//Check to see if there's a title
		var title = document.getElementById("new-post-title").value,
			content = document.getElementById("new-post-content").value;

		if(!Offlog.config("current_draft")) {
			//create a new article instance
			if(!title) return new Offlog.Notification("error", "No Title", "Please supply a title before saving");

			var article = new Offlog.Article(title, content);
			var id = article.save();

			Offlog.config("current_draft", id);

		} else {
			var drafts = new Offlog.List(Offlog.config("drafts"));
			var article = drafts.getItemById(Offlog.config("current_draft"));

			article.title = title;
			article.content = content;
			article.timestamp = (new Date()).toJSON();

			drafts.updateItemById(article.id, article);
			Offlog.config("drafts", drafts.toJSON());
		}
		
		return new Offlog.Notification("success", "Draft saved", "Draft successfully saved.");
	})

	Offlog.main.resizeElement(this, document.getElementById("new-post-content"), 70);
});