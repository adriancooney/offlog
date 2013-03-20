Offlog.registerView("NewBlog", function() {
	console.log("REndering view Welcome");
	Offlog.Template.render("new-blog", Offlog.containers.main);
});