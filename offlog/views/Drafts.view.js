Offlog.registerView("Drafts", function() {
	Offlog.Template.render("drafts", Offlog.containers.main, {
		drafts: Offlog.config("drafts") || []
	});

	Offlog.main.resizeElement(this, document.querySelectorAll(".preview")[0]);
});