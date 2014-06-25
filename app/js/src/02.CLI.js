var CLI = function() {
	var api = {},
		el = Utils.el,
		field = el('[data-component="cli-input"]'),
		listeners = {};

	var parseCommand = function(str) {
		var parts = str.split(/ /g);
		var command = parts.shift();
		return {
			command: command,
			parts: parts
		}
	}

	field.focus();
	Utils.on(field, 'keyup', function(e) {
		if(e.keyCode == 13) {
			api.dispatch('command', parseCommand(field.value));
			field.value = '';
		} else {
			api.dispatch('update', parseCommand(field.value));
		}
	});
	Utils.on(field, 'keydown', function(e) {
		if(e.keyCode == 9) {
			e.preventDefault();
			api.dispatch('autocomplete');
		}
	});
	api.on = function(event, cb) {
		if(!listeners[event]) listeners[event] = [];
		listeners[event].push(cb);
		return api;
	}
	api.dispatch = function(event, data) {
		if(listeners[event]) {
			for(var i=0; i<listeners[event].length; i++) {
				listeners[event][i](data);
			}
		}
		return api;
	}
	api.setValue = function(str) {
		field.value = str;
	}
	return api;
}