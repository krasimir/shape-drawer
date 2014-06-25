var Drawer = function() {
	var api = {}, c, plotW, plotH, loop, checkedPixels,
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
	api.line = function(x1, y1, x2, y2, color) {
		/*(rectangle x1 y1 x2 y2 color) - Draws a rectangle*/
		if(arguments.length < 4) {
			throw new Error('Missing parameters. The command "line" requires at least 4 arguments.');
		}
		c.beginPath();
	    c.moveTo(x1, y1);
	    c.lineTo(x2, y2);
	    c.strokeStyle = color || '#FFF';
      	c.lineWidth = 6;
      	c.stroke();
	}
	api.fill = function(x, y, newColor) {
		/*(fill x y color) - flood filling*/
		if(arguments.length < 2) {
			throw new Error('Missing parameters. The command "fill" requires at least 2 arguments.');
		}
		c.fillStyle = newColor || '#FFF';
		fill(x, y, plot, c, newColor);
	}
	api.circle = function(x, y, radius, color, strokeColor) {
		/*(circle x y radius color strokeColor) - draws a circle*/
		if(arguments.length < 3) {
			throw new Error('Missing parameters. The command "circle" requires at least 3 arguments.');
		}
		c.beginPath();
		c.arc(x, y, radius, 0, 2 * Math.PI, false);
		c.fillStyle = color || '#FFF';
		c.fill();
		c.lineWidth = 6;
		c.strokeStyle = strokeColor || '#000';
		c.stroke();
	}
	return api;
}