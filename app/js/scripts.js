var Utils = {
	el: function(selector, parent) {
		return (parent || document).querySelector(selector);
	},
	on: function(obj, evt, fnc) {
	    if (obj.addEventListener) { // W3C model
	        obj.addEventListener(evt, fnc, false);
	        return true;
	    } else if (obj.attachEvent) { // Microsoft model
	        return obj.attachEvent('on' + evt, fnc);
	    }
	}
}
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
var Drawer = function() {
	var api = {}, c, plotW, plotH,
		plot = Utils.el('[data-component="plot"]');

	// setting the size of the canvas
	plot.setAttribute('width', plotW = plot.parentNode.offsetWidth);
	plot.setAttribute('height', plotH = plot.parentNode.offsetHeight);

	c = plot.getContext('2d');

	api.clear = function(color) {
		c.fillStyle = color;
		c.fillRect(0, 0, plotW, plotH);
	}
	return api;
}
var Tooltip = function() {
	var api = {}, element = Utils.el('[data-component^="tooltip"]');
	api.show = function(str) {
		element.setAttribute('data-component', 'tooltip-visible');
		Utils.el('span', element).innerHTML = str;
		return this;
	}
	api.hide = function() {
		element.setAttribute('data-component', 'tooltip-hidden');
	}
	return api;
}
var App = function() {
	var drawer = Drawer(), tooltip = Tooltip();
	CLI().on('command', function(data) {
		var parts = data.command.split(/ /g);
		var command = parts.shift();
		if(drawer[command]) {
			drawer[command].apply(drawer, parts);
		} else {
			console.log('there is no ' + command + ' command');
		}
	});
};
(function(w) {
	w.onload = function() {
		App();
	}
})(window);