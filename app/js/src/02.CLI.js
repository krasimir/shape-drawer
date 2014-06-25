var CLI = function() {
	var api = {},
		el = Utils.el,
		field = el('[data-component="cli-input"]'),
		listeners = {};

	field.focus();
	Utils.on(field, 'keydown', function(e) {
		if(e.keyCode == 13) {
			api.dispatch('command', { command: field.value });
			field.value = '';
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
	return api;
}