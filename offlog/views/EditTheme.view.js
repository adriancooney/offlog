Offlog.registerView("EditTheme", function() {
	Offlog.Template.render("edit-theme", Offlog.containers.main);

	var cm = document.getElementById("codemirror");

	var myCodeMirror = CodeMirror(cm, {
		value: "function myScript(){return 100;}\n",
		mode: "javascript",
		lineNumbers: "true",
		theme: "elegant"
	});

	var editing = document.querySelectorAll(".editing")[0];
	Offlog.main.resizeElement(this, editing);

	//Preety damn hacky but whatevs
	editing.style.width = (window.innerWidth - Offlog.containers.sidebar.clientWidth) + "px";

	var dragging = false, startXPos;
	var grab = document.getElementById("grab");

	grab.addEventListener("mousedown", function() {
		dragging = true;
	});

	var max = cm.clientWidth, min = window.innerWidth - (Offlog.containers.sidebar.clientWidth + 980);

	console.log(max);
	window.addEventListener("mousemove", function(e) {
		e.preventDefault();

		var x = e.clientX - Offlog.containers.sidebar.clientWidth,
			pos = (x >= max) ? max : ((x <= min) ? min : x);

		if(dragging == true) document.querySelectorAll(".expandable")[0].style.marginLeft = pos + "px";
		return false;
	}, true);

	grab.addEventListener("mouseup", function() {
		dragging = false;
	});
});