Offlog.registerView("Drafts", ["drafts"], function(view, data) {
	var drafts = new Offlog.List(data.drafts)

	Offlog.Template.render("drafts", Offlog.containers.main, {
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

	var draftsList = document.querySelectorAll(".drafts-list li"),
		toolbar = document.getElementById("toolbar"),
		placeholder = document.querySelectorAll(".placeholder")[0];

	Array.prototype.forEach.call(draftsList, function(draft) {
		draft.addEventListener("click", function() {
			var id = parseInt(this.id.replace("article-", ""));

			displayDraft(drafts.getItemById(id));
		});
	});

	function displayDraft(draft) {

		var title = "<h1>" + draft.title + "</h1>",
			content = markdown.toHTML(draft.content);

		placeholder.setAttribute("data-article", draft.id);

		toolbar.classList.remove("inactive");

		placeholder.innerHTML = title + content;
	}

	this.addEventListener(document.getElementById("continue-editing-draft"), "click", function() {
		Offlog.config("current_draft", parseInt(placeholder.getAttribute("data-article")));

		Offlog.renderView("NewPost")
	})

	this.addEventListener(document.getElementById("delete-draft"), "click", function() {

		Offlog.confirm("Are you sure you want to delete this draft?", function() {
			var id = parseInt(placeholder.getAttribute("data-article"));

			Offlog.config("current_draft", function(current_draft) {
				if(current_draft == id) Offlog.config("rm", "current_draft");
				drafts.removeItemById(id);
				Offlog.config("drafts", drafts.toObject());

				view.render();
			});
		});
		
	})

	Offlog.main.resizeElement(this, document.querySelectorAll(".preview")[0]);
});