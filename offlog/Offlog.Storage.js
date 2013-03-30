Offlog.Storage = {
	api: chrome.storage.local,
	_prefix: "offlog_",
	store: {},

	prefix: function(o, f) {
		var that = this;
		if(o instanceof Array) o = o.map(function(v) { return f(v); });
		else if(o instanceof Object) { var n = {}; for(var key in o) n[f(key)] = o[key]; o = n; }
		else if(typeof o == "string") o = f(o); //Hrm, "" instanceof String == false

		return o;
	},

	addPrefix: function(obj) {
		var prefix = this._prefix;
		return this.prefix(obj, function(key) {
			return prefix + key;
		});
	},

	removePrefix: function(obj) {
		var prefix = this._prefix;
		return this.prefix(obj, function(key) {
			return key.replace(prefix, "");
		});
	},

	"get": function(name, callback) {
		var that = this,
			names = name; //that.addPrefix(name);
		this.api.get(names, function(data) {
			var obj = data; //that.removePrefix(data);

			//Loop through and run preprocessors
			for(var key in obj) {
				if(typeof obj[key] == "object" && obj[key].list) {
					obj[key] = new Offlog.List(obj[key]);
				}
			}

			callback(obj);
		});
	},

	"set": function(name, value, callback) {
		if(typeof value == "function") callback = value, value = undefined;

		//Storage only takes objects
		if(typeof name == "string" && value) {
			var c = {};
			c[name] = value;
			name = c;
		}

		//Loop over values
		for(var key in name) {
			if(name[key] instanceof Offlog.List) name[key] = name[key].toObject();
		}

		var names = name; //this.addPrefix(name);

		this.api.set(names, callback);
	},

	"remove": function(name, callback) {
		this.api.remove(name);
	},

	setIfNotExists: function(name, value, callback) {
		console.log("Setting if not exists");
		var that = this;
		this.get(name, function(store) {
			if(!store[name]) {
				console.log("Does not exist");
				that.set(name, value, callback);
			} else {
				console.log("Exists", name);
			}
		})
	}
};