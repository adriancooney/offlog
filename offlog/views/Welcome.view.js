Offlog.registerView("Welcome", function() {
	console.log("REndering view Welcome");
	Offlog.Template.render("welcome", Offlog.containers.main);
});