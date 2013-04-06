Offlog.registerView("Articles", function(view, data) {
	var drafts = data.drafts;

	Offlog.Template.render("articles", Offlog.containers.main, {
		drafts: drafts.list,

		"drafts_empty": function() {
			if(this.drafts.length == 0) return true;
			else return false;
		},

		"date": function() {
			//This is a really nice library, kudos
			//https://github.com/zachleat/Humane-Dates
			return humaneDate(this.timestamp);
		}
	});

	var draftsList = document.querySelectorAll(".articles-list li"),
		toolbar = document.getElementById("toolbar"),
		placeholder = document.querySelectorAll(".placeholder")[0];

	Array.prototype.forEach.call(draftsList, function(draft) {
		draft.addEventListener("click", function() {
			var id = parseInt(this.id.replace("article-", ""));

			displayDraft(drafts.getItemById(id));
		});
	});

	function displayArticle(article) {
		var title = "<h1>" + article.title + "</h1>",
			content = markdown.toHTML(article.content);

		placeholder.setAttribute("data-article", article.id);

		toolbar.classList.remove("inactive");

		placeholder.innerHTML = title + content;
	}

	this.addEventListener(document.getElementById("continue-editing-draft"), "click", function() {
		Offlog.Storage.set("current_draft", parseInt(placeholder.getAttribute("data-article")));

		Offlog.renderView("NewPost")
	})

	this.addEventListener(document.getElementById("delete-article"), "click", function() {

		Offlog.confirm("Are you sure you want to delete this article?", function() {
			var id = parseInt(placeholder.getAttribute("data-article"));

			Offlog.Storage.get("current_draft", function(data) {
				var current_draft = data.current_draft;
				if(current_draft == id) Offlog.Storage.remove("current_draft");
				drafts.removeItemById(id);
				Offlog.Storage.set("drafts", drafts.toObject());

				view.render();
			});
		});
		
	})

	Offlog.main.resizeElement(this, document.querySelectorAll(".preview")[0]);
});