Offlog.registerView("Drafts", function() {
	Offlog.Template.render("drafts", Offlog.containers.main);

	Offlog.main.resizeElement(this, document.querySelectorAll(".preview")[0]);
});