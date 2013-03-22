Offlog.registerView("NewBlog", function() {
	Offlog.Template.render("new-blog", Offlog.containers.main);

	this.addEventListener(document.getElementById("action-newblog"), "click", function(e) {
		var form = document.getElementById("create-blog"),
			inputs = form.querySelectorAll("input[type=text], textarea, select"),
			required = ["name", "theme", "root_location"],
			aliases = {
				"root_location": "Root Location",
				"name": "Blog Name"
			}, values = {};

		for(var i = 0; i < inputs.length; i++) {
			var input = inputs[i], inputName = input.getAttribute("name");

			if(required.indexOf(inputName) !== -1 && input.value == "") return new Offlog.Notification("error", "New Blog Error", "Please fill out the '" + aliases[inputName] + "' field."); 
			
			values[inputName] = input.value;
		}

		//Check to see if the root location is unique
		var blogs = Offlog.config("blogs") || [];
		for(var i = 0; i < blogs.length; i++) if(blogs[i].root_location == values["root_location"]) return new Offlog.Notification("error", "Root location not unique", "That root location is already in use on blog '" + blogs[i].title + "'.");

		//Inputs sanitized
		var blog =  new Offlog.Blog({
			title: values["name"],
			theme: values["theme"],
			root_location: values["root_location"],
			description: values["description"]
		})

		blog.save();

		new Offlog.Notification("success", "Successfully created blog", "Successfully created blog '" + values["name"] + "'");

		//Set it as the current blog
		Offlog.config("blog_context", blog.blog.id);

		Offlog.renderView("Home");
	})
});