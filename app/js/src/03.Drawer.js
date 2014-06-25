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