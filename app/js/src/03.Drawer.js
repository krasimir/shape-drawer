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
	api.rectangle = function(x, y, w, h, color) {
		/*(rectangle x y w h color) - Draws a rectangle*/
		if(arguments.length < 4) {
			throw new Error('Missing parameters. The command "rectangle" requires at least 4 arguments.');
		}
		c.fillStyle = color || '#FFF';
		c.fillRect(x, y, w, h);
	}
	return api;
}