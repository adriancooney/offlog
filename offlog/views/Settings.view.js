Offlog.registerView("Settings", function() {
	Offlog.Template.render("settings", Offlog.containers.main);

	this.addEventListener(document.getElementById("github"), "click", function() {
		window.open("https://github.com/login/oauth/authorize?client_id=2143ac0ba460d74d319d", "Google.com", "height=500,width=500");
	})
});