Offlog.registerView("EditTheme", function() {
	Offlog.Template.render("edit-theme", Offlog.containers.main);

	var cm = document.getElementById("codemirror");

	var myCodeMirror = CodeMirror(cm, {
		value: "function myScript(){return 100;}\n",
		mode: "javascript",
		lineNumbers: "true",
		theme: "elegant"
	});

	//And resize
	cm.children[0].style.height = (window.innerHeight - 47) + "px";

	this.addEventListener(window, "resize", function() {
		cm.children[0].style.height = (window.innerHeight - 47) + "px";
	})
});