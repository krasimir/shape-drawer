var Tooltip = function() {
	var api = {}, element = Utils.el('[data-component^="tooltip"]');
	api.show = function(str) {
		element.setAttribute('data-component', 'tooltip-visible');
		Utils.el('span', element).innerHTML = str;
		return this;
	}
	api.hide = function() {
		element.setAttribute('data-component', 'tooltip-hidden');
	}
	return api;
}