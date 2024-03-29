Offlog.registerView("Settings", function(view, data) {
	var gh_integration = data.gh_integration,
		author = data.author;


	var notIntegrated = "<h4 class=\"integrated not\"><i class=\"icon-warning-sign\"></i> Github not integrated.</h4>";
	var isIntegrated = "<h4 class=\"integrated\"><i class=\"icon-ok\"></i> Github integrated.</h4>";
	var actionIntegrate = "<h5 class=\"github-button\" id=\"github-signin\"><i class=\"icon-github\"></i><span>Github Login</span></h5>";
	var actionDeauthorize = "<h5 class=\"github-button\" id=\"github-deauthorize\"><i class=\"icon-github\"></i><span>Remove Account</span></h5>";


	Offlog.Template.render("settings", Offlog.containers.main, {
		"author": author,
		"integration_text": gh_integration ? isIntegrated : notIntegrated,
		"integration_disabled": gh_integration ? "disabled" : "",
		"integration_actions": gh_integration ? actionDeauthorize : actionIntegrate,
		"writing": data.writing
	});

	this.addEventListener(document.getElementById("github-deauthorize"), "click", function() {
		// De authorize the user
		Offlog.Storage.remove(["gh_integration", "gh_password", "gh_username", "author"]);

		view.render();
		new Offlog.Notification("success", "Github Deauthorized", "Github account deauthorized successfully.");
	});

	this.addEventListener(document.getElementById("github-signin"), "click", function() {
		view.render();
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

						//And set the user information
						Offlog.Storage.set("gh_integration", true);
						Offlog.Storage.set("gh_username", username);

						// Not a fan of this but impossible to travel between sessions without it
						Offlog.Storage.set("gh_password", Base64.encode(password));

						//Set the user information
						Offlog.Github.getAuthorInformation(function(user) {
							view.render();
						});
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

	Array.prototype.forEach.call(document.querySelectorAll("input[type=text], textarea"), function(input) {
		input.addEventListener("keydown", function(key) {
			console.log(key);
			if(key.which == 13 || key.which == 9 && !key.shiftKey) {
				if(key.which !== 9) key.preventDefault();

				var input = this.getAttribute("name").split("-"),
					that = this;

				Offlog.Storage.get(input[0], function(data) {
					var obj = data[input[0]] || {};

					obj[input[1]] = that.value;

					console.log(that.value)

					var save = {};
					save[input[0]] = obj;

					Offlog.Storage.set(save);

					new Offlog.Notification("success", "Information saved", "Information successfully saved.");
				});
			}
		})
	});
});