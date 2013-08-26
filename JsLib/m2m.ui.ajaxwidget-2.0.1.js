// m2m.ui.ajaxwidget-2.0.1.js
(function(exports, $) {
	exports.AjaxWidget = AjaxWidget;

	var _opt = {
		data : undefined,
		url : undefined,
		autoLoad : false
	}, _event = {
		beforeLoad : 'preLoad',
		loadSuccess : 'loadSuccess',
		loadFailed : 'loadFailed'
	}, _version = '0.1.0';

	// ajax 组件的父类
	function AjaxWidget(options) {
		exports.Widget.call(this, options, _version);
		$.extend(this.settings, _opt, options || {});
	}

	$.extend(AjaxWidget.prototype, new exports.Widget(), {
				load : function(opt) {
					this._emit(_event.beforeLoad);
				},
				_init : function() {
					if (this.settings.autoLoad) {
						this._render(this.settings.data);
					}
				},
				_render : function(data) {

				}
			});

})(require('./m2m.ui.core-2.0.1.js'), require('./m2m.ui.utils-2.0.1.js'));