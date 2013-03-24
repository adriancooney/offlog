Offlog.registerView("NewBlog", function(view, data) {
	var editMode = (data) ? data.editMode : false,
		blogs = data.blogs,
		blog_context = data.blog_context;


	Offlog.Template.render("new-blog", Offlog.containers.main, {
		action: editMode ? "Update" : "New",
		blog: (editMode && blog_context) ? blogs.getItemById(blog_context) : {},
		button: editMode ? "Update" : "Submit"
	});

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
		var blogsArr = blogs.list || [];
		for(var i = 0; i < blogsArr.length; i++) if(blogsArr[i].root_location == values["root_location"]) return new Offlog.Notification("error", "Root location not unique", "That root location is already in use on blog '" + blogs[i].title + "'.");

		if(!editMode) {
			//Inputs sanitized
			var blog =  new Offlog.Blog({
				title: values["name"],
				theme: values["theme"],
				root_location: values["root_location"],
				description: values["description"]
			})

			var id = blog.save(function(id) {

				//Set it as the current blog
				Offlog.Storage.set("blog_context", id);
			});

			new Offlog.Notification("success", "Successfully created blog", "Successfully created blog '" + values["name"] + "'");

		} else {
			var blog = blogs.getItemById(blog_context);

			blog.title = values["name"];
			blog.theme = values["theme"];
			blog.root_location = values["root_location"];
			blog.description = values["description"];

			blogs.updateItemById(blog.id, blog);

			new Offlog.Notification("success", "Successfully updated blog", "Successfully updated blog '" + values["name"] + "'");

		}

		Offlog.renderView("Home");
	})
});