var App = function() {

	var drawer = Drawer(), 
		tooltip = Tooltip(),
		matchedMethods = [],
		cli;

	var showAllAvailCommands = function() {
		var methods = [], msg = '';
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
			try {
				drawer[data.command].apply(drawer, data.parts);
			} catch(e) {
				tooltip.show('Error: ' + e.message);
			}
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
				var entry = matchedMethods[i];
				var desc = drawer[entry.name].toString().match(/\/\*(.*)+\*\//);
				methodsStr += entry.name.replace(entry.part, '<strong><u>' + entry.part + '</u></strong>');
				methodsStr += '<br /><small>' + desc[1] + '</small>';
				if(i < numOfMethods-1) methodsStr += '<br />';
			}
			methodsStr += '<br /><hr /><small>(press the TAB key to grab the first match)</small>'
			tooltip.show(methodsStr);
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