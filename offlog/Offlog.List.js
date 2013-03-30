/**
 * Database like list functionality with id's for objects
 * @param {object} list And existing list
 */
Offlog.List = function(list) {
	if(list && typeof list == "object") {
		// Existing list
		this.list = list.list;
		this.lastInsertId = list.lastInsertId;
	} else if(typeof list == "string") {
		var o = JSON.parse(list);
		// Existing list
		this.list = o.list;
		this.lastInsertId = o.lastInsertId;
	} else {
		// New list
		this.list = [];
		this.lastInsertId = 0;
	}

	this.__defineGetter__("length", function() {
		return this.list.length;
	});
};

Offlog.List.prototype.toJSON = function() {
	return JSON.stringify({
		list: this.list,
		lastInsertId: this.lastInsertId
	});
};

Offlog.List.prototype.toObject = function() {
	return {
		list: this.list,
		lastInsertId: this.lastInsertId
	};
};

Offlog.List.prototype.addItem = function(data) {
	this.lastInsertId++;
	data.id = this.lastInsertId;
	this.list.push(data);
	return data;
};

Offlog.List.prototype.updateItemById = function(id, data) {
	for(var i = 0; i < this.list.length; i++) if(this.list[i].id == id) {
		data.id = id;
		this.list[i] = data;
	}
};

Offlog.List.prototype.removeItemById = function(id) {
	for(var i = 0; i < this.list.length; i++) if(this.list[i].id == id) this.list.splice(i, 1);
};

Offlog.List.prototype.getItemById = function(id) {
	for(var i = 0; i < this.list.length; i++) if(this.list[i].id == id) return this.list[i];
};