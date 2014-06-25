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
	    return this;
	}
}
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
var Drawer = function() {
	var api = {}, c, plotW, plotH,
		plot = Utils.el('[data-component="plot"]');

	// setting the size of the canvas
	plot.setAttribute('width', plotW = plot.parentNode.offsetWidth);
	plot.setAttribute('height', plotH = plot.parentNode.offsetHeight);

	c = plot.getContext('2d');

	api.clear = function(color) {
		/*(clear) - Sets the background color of the canvas*/
		c.fillStyle = color || '#FFF';
		c.fillRect(0, 0, plotW, plotH);
	}
	return api;
}
var Tooltip = function() {
	var api = {}, element = Utils.el('[data-component^="tooltip"]'), interval;
	api.show = function(str, hideAfter) {
		element.setAttribute('data-component', 'tooltip-visible');
		Utils.el('span', element).innerHTML = str;
		clearTimeout(interval);
		if(hideAfter) {
			interval = setTimeout(api.hide, hideAfter);
		}
		return this;
	}
	api.hide = function() {
		clearTimeout(interval);
		element.setAttribute('data-component', 'tooltip-hidden');
	}
	return api;
}
var App = function() {

	var drawer = Drawer(), 
		tooltip = Tooltip(),
		matchedMethods = [],
		cli;

	var showAllAvailCommands = function() {
		var methods = [], msg = '<strong>Commands:</strong><br />';
		for(var method in drawer) {
			var desc = drawer[method].toString().match(/\/\*(.*)+\*\//);
			msg += method + '<br /><small>' + desc[1] + '</small><br />';
		}
		tooltip.show(msg);
	}

	cli = CLI().on('command', function(data) {		
		if(data.command === '?') {
			showAllAvailCommands(); 
			return;
		}
		matchedMethods = [];
		tooltip.hide();
		if(drawer[data.command]) {
			drawer[data.command].apply(drawer, data.parts);
		} else {
			tooltip.show('Missing command "' + data.command + '"!', 2000);
		}
	}).on('update', function(data) {
		var command = data.command;
		matchedMethods = [];
		for(var method in drawer) {
			var regExp = new RegExp('^' + command.replace('?', '\\?'));
			var match = method.toString().match(regExp);
			if(match && match[0] !== '') {
				matchedMethods.push({ name: method, part: match[0]});
			}
		}
		if(matchedMethods.length > 0) {
			var methodsStr = '', numOfMethods = matchedMethods.length;
			for(var i=0; i<numOfMethods; i++) {
				methodsStr += matchedMethods[i].name.replace(matchedMethods[i].part, '<strong><u>' + matchedMethods[i].part + '</u></strong>');
				if(i < numOfMethods-1) methodsStr += ', ';
			}
			methodsStr += '. <small>(press the TAB key to grab the first match)</small>'
			tooltip.show('Available methods: ' + methodsStr);
		} else {
			tooltip.hide();
		}
	}).on('autocomplete', function() {
		if(matchedMethods.length > 0) {
			cli.setValue(matchedMethods[0].name);
		}
	});

};

(function(w) {
	w.onload = function() {
		App();
	}
})(window);