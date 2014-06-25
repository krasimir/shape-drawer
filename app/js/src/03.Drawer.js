var Drawer = function() {
	var api = {},
		plot = Utils.el('[data-component="plot"]'),
		c = plot.getContext('2d');

	api.clear = function(color) {
		console.log(arguments);
		c.fillStyle = color;
		c.fillRect(0, 0, 10, 10);
	}
	return api;
}