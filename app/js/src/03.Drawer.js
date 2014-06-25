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