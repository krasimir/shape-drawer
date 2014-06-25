var App = function() {
	var d = Drawer();
	CLI().on('command', function(data) {
		var parts = data.command.split(/ /g);
		var command = parts.shift();
		if(d[command]) {
			d[command].apply(d, parts);
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