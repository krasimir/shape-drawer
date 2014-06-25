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
			throw new Error('Missing parameters. The command "rectangle" requires at least 4 arguments.');
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
};
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

(function () {
    var canvas, context = null;

    var toRGB = function (color) {
        var r, g, b, a, html;
        html = color;

        // Parse out the RGBA values from the HTML Code
        if (html.substring(0, 1) === "#")
        {
          html = html.substring(1);
        }

        if (html.length === 3 || html.length === 4)
        {
          r = html.substring(0, 1);
          r = r + r;

          g = html.substring(1, 2);
          g = g + g;

          b = html.substring(2, 3);
          b = b + b;

          if (html.length === 4) {
            a = html.substring(3, 4);
            a = a + a;
          }
          else {
            a = "ff";
          }
        }
        else if (html.length === 6 || html.length === 8)
        {
          r = html.substring(0, 2);
          g = html.substring(2, 4);
          b = html.substring(4, 6);
          a = html.length === 6 ? "ff" : html.substring(6, 8);
        }

        // Convert from Hex (Hexidecimal) to Decimal
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        a = parseInt(a, 16);
        return {r: r, g: g, b: b, a: a};
      }

    fill = function(x, y, canvas, context, newColor) {
        var image = context.getImageData(x, y, 1, 1);
        var original = image.data;                
        var inverse = toRGB(newColor);

        var queue = [];
        queue.push({ "x": x, "y": y });

        var workThunk = function() {
            var counter = 0;
            while(queue.length && counter < 30) {
                workOnPixel();
                counter++;
            }
            if (queue.length) {
                requestAnimationFrame(workThunk);
            }
        };

        var workOnPixel = function() {
            var point = queue.pop();
            image = context.getImageData(point.x, point.y, 1, 1);
            var pixel = image.data;
            
            if (pixel[0] == original[0] &&
                pixel[1] == original[1] &&
                pixel[2] == original[2] &&
                pixel[3] == original[3]) {

                pixel[0] = inverse[0];
                pixel[1] = inverse[1];
                pixel[2] = inverse[2];
                pixel[3] = inverse[3];
                context.fillRect(point.x, point.y, 1, 1);
                
                if (point.x > 0) {
                    queue.push({ "x": point.x - 1, "y": point.y });
                }
                if (point.y > 0) {
                    queue.push({ "x": point.x, "y": point.y - 1 });
                }
                if (point.x < canvas.width) {
                    queue.push({ "x": point.x + 1, "y": point.y });
                }
                if (point.y < canvas.height) {
                    queue.push({ "x": point.x, "y": point.y + 1 });
                }
            }                                       
        };
        
        requestAnimationFrame(workThunk);                
    };

}());
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