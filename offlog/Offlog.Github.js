Offlog.Github = {
	auth: "basic",

	testCredentials: function(username, pw, callback) {
		var gb = new Github({
			username: username,
			password: pw,
			auth: Offlog.Github.auth
		}).getUser().show(username, this.callback(function(user) {
			callback(true);
		}, function(e) {
			if(e.error == 403 || e.error == 401) callback(false);
		}));
	},

	callback: function(clbk, error) {
		// Slick error handling baby, wildcard or manual
		var that = this;
		return function() {
			var args = Array.prototype.slice.call(arguments);
			if(args[0]) error ? error(args[0]) : that.error(args[0]);
			else clbk(args.slice(1));
		}
	},

	error: function(e) {
		// Error codes
		// HTTP 4XX
		// Custom Errors
		// 		1 -- Github not integrated

		switch( e ) {
			case 1:
				new Offlog.Notification("error", "Github not integrated", "Please visit the settings pane and login to Github.");
			break;
		}
	},

	// Singleton Class for the github API
	api: function(callback) {
		if(!this.gh) {
			var that = this;
			Offlog.Storage.get(["gh_integrated", "gh_username", "gh_password"], function(data) {
				if(data.gh_integrated)
					Offlog.gh = new Github({
						username: data.gh_username,
						password: Base64.decode(data.gh_password),
						auth: "basic"
					}), callback(Offlog.gh);
				else that.error(1);
			});
		} else callback(this.gh);
	},

	getAuthorInformation: function(clbk) {
		Offlog.Storage.get("gh_username", function(data) {
			var username = data.username;
			Offlog.Github.getUser(username, function(user) {
				user = user[0];

				Offlog.Storage.set("author", user);

				clbk();
			});
		});
	},

	getUser: function(username, callback) {
		Offlog.Github.api(function(api) {
			api.getUser().show(username, Offlog.Github.callback(callback));
		})
	}
};