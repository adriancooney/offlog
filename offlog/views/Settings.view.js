Offlog.registerView("Settings", function(view) {

	var notIntegrated = "<h4 class=\"integrated not\"><i class=\"icon-warning-sign\"></i> Github not integrated.</h4>";
	var isIntegrated = "<h4 class=\"integrated\"><i class=\"icon-ok\"></i> Github integrated.</h4>";
	var actionIntegrate = "<h5 class=\"github-button\" id=\"github-signin\"><i class=\"icon-github\"></i><span>Github Login</span></h5>";
	var actionDeauthorize = "<h5 class=\"github-button\" id=\"github-deauthorize\"><i class=\"icon-github\"></i><span>Remove Account</span></h5>";


	Offlog.Template.render("settings", Offlog.containers.main, {
		"author_name": Offlog.config("author_name"),
		"author_email": Offlog.config("author_email"),
		"author_bio": Offlog.config("author_bio"),
		"integration_text": Offlog.config("gh_integration") ? isIntegrated : notIntegrated,
		"integration_disabled": Offlog.config("gh_integration") ? "disabled" : "",
		"integration_actions": Offlog.config("gh_integration") ? actionDeauthorize : actionIntegrate
	});

	this.addEventListener(document.getElementById("github-deauthorize"), "click", function() {
		// De authorize the user
		Offlog.config("rm", ["gh_integration", "gh_password", "gh_username"]);

		new Offlog.Notification("success", "Github Deauthorized", "Github account deauthorized successfully.");
	});

	this.addEventListener(document.getElementById("github-signin"), "click", function() {
		console.log(this);
		var modal = new Offlog.Modal(Mustache.render(Offlog.Template.templates["github-login"][0]), 400, 340);

		// Bind the events to the buttons
		document.getElementById("cancel-login").addEventListener("click", function() {
			modal.die();
		});

		document.getElementById("submit-login").addEventListener("click", function() {

			var username = document.getElementById("login-username").value,
				password = document.getElementById("login-password").value;

			if(username && password) {
				showLoader();

				Offlog.Github.testCredentials(username, password, function(valid) {
					hideLoader();

					if(valid) {
						new Offlog.Notification("success", "Valid Credentials", "Your Github credentials are valid.");
						modal.die();

						//And set the interface
						Offlog.Github.api(username, password);

						showUserInformation();
					} else new Offlog.Notification("error", "Invalid Credentials", "Please provide valid Github credentials.");
				})
			} else {
				new Offlog.Notification("error", "Credentials", "Please provide a username and password.")
			}
		});

		function showLoader() {
			document.getElementById("load").classList.remove("inactive");
		}

		function hideLoader() {
			document.getElementById("load").classList.add("inactive");
		}
	});
});