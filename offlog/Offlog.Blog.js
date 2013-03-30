/**
 * Offlog Blog class
 */
Offlog.Blog = function(data) {
	var defaults = {
		theme: "default",
		articles: [],
		timestamp: new Date().toJSON()
	};

	for(var key in defaults) if(!data[key]) data[key] = defaults[key];

	this.blog = data;
};

Offlog.Blog.prototype.compile = function() {
	var theme = this.getTheme(theme);

	//Right so, compilation
	//First off, we a need a config file for Offlog to allow users to switch 
	//between computers. Secondly, we need an index.html, and folders with their
	//own index.html for articles.
	

};

Offlog.Blog.prototype.compilePage = function(page, data) {
	switch( page ) {
		case "index":
			var page;

			//Index takes articles in short form
			console.log(this);
		break;

		case "article":

		break;
	}
};

Offlog.Blog.prototype.getTheme = function(theme) {
	return exampleTheme;
};

Offlog.Blog.prototype.save = function(callback) {
	var that = this;
	Offlog.Storage.get("blogs", function(data) {
		var id = data.blogs.addItem(that.blog)
		Offlog.Storage.set("blogs", data.blogs);
		callback(id.id);
	});
};