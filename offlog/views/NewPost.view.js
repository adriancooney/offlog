Offlog.registerView("NewPost", ["blogs", "blog_context", "current_draft", "drafts"], function(view, data) {
	var blogs = new Offlog.List(data.blogs),
		drafts = new Offlog.List(data.drafts),
		blog_context = data.blog_context,
		current_draft = data.current_draft;

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
				return draft.getItemById(current_draft).title;
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

		Offlog.config("current_draft", function(data) {
			if(!data.current_draft) {
				//create a new article instance
				if(!title) return new Offlog.Notification("error", "No Title", "Please supply a title before saving");

				var article = new Offlog.Article(title, content);
				var id = article.save();

				Offlog.config("current_draft", id);

			} else {
				Offlog.config(["drafts", "current_draft"], function(data) {
					var drafts = new Offlog.List(data.drafts);
					var article = drafts.getItemById(data.current_draft);

					article.title = title;
					article.content = content;
					article.timestamp = (new Date()).toJSON();

					drafts.updateItemById(article.id, article);
					Offlog.config("drafts", drafts.toObject());
				});
			}
		});
		
		return new Offlog.Notification("success", "Draft saved", "Draft successfully saved.");
	})

	Offlog.main.resizeElement(this, document.getElementById("new-post-content"), 70);
});