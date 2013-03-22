Offlog.registerView("NewPost", function() {
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
		}
	});

	this.addEventListener(document.getElementById("post-save"), "click", function() {
		//Check to see if there's a title
		var title = document.getElementById("new-post-title").value,
			content = document.getElementById("new-post-content").value;

		if(!Offlog.config("current_draft")) {
			//create a new article instance
			if(!title) return new Offlog.Notification("error", "No Title", "Please supply a title before saving");

			var article = new Offlog.Article(title, content);
			article.save();

			Offlog.config("current_draft", article.id);
			return new Offlog.Notification("success", "Draft saved", "Draft successfully saved.");
		} else {
			var article = Offlog.config("drafts")[Offlog.config("current_draft") - 1];

			article.update({
				title: title,
				content: content
			});
		}
	})

	Offlog.main.resizeElement(this, document.getElementById("new-post-content"), 70);
});