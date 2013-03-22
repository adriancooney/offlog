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

	
});