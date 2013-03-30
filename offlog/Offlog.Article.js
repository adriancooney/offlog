/**
 * Offlog's article storage system
 * @param {string} title The title of the article
 * @param {string} text  The content of the article
 */
Offlog.Article = function(title, text) {
	this.article = {
		title: title,
		content: text,
		timestamp: new Date().toJSON(),
		published: false
	};
};

Offlog.Article.prototype.save = function(callback) {
	var that = this;
	Offlog.Storage.get("drafts", function(data) {
		var id = data.drafts.addItem(that.article)
		Offlog.Storage.set("drafts", data.drafts);

		callback(id.id);
	});
};