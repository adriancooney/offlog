var express = require("express"),
	app = express();

app.use(express.static("../"));
app.listen(8181);