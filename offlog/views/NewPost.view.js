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
		}
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