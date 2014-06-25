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