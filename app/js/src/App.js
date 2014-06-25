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