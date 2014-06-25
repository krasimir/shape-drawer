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