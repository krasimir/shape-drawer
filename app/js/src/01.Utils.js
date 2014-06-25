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
	}
}