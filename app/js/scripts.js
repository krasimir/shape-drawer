var Utils = {
	el: function(selector) {
		return document && document.querySelector(selector);
	}
}
var CLI = function() {
	var api = {},
		el = Utils.el,
		field = el('[data-component="cli-input"]');

	field.focus();

	return api;
}
var App = function() {
	cli = CLI();
};
(function(w) {
	w.onload = function() {
		App();
	}
})(window);