var App = function() {
	var drawer = Drawer(), 
		tooltip = Tooltip(),
		matchedMethods = [],
		cli;
	cli = CLI().on('command', function(data) {
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