var CLI = function() {
	var api = {},
		el = Utils.el,
		field = el('[data-component="cli-input"]');

	field.focus();

	return api;
}