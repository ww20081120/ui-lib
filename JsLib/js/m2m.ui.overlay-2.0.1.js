// m2m.ui.overlay-2.0.1.js
(function(exports, $, html) {
	exports.Overlay = Overlay;
	
	exports.overlay = function(options){
		var deferred = $.Deferred();
  		return deferred.promise(new Overlay(options,deferred));
	};
	var _opt = {}, _event = {}, _version = '2.0.1';

	// ajax 组件的父类
	function Overlay(options,deffered) {
		exports.Widget.call(this, options, _version,deffered);
		$.extend(this.settings, _opt, options || {});
	}

	$.extend(Overlay.prototype, new exports.Widget(), {
				show : function() {
					this.$el.show();
				},
				hide : function() {
					this.$el.hide();
				},
				close : function(){
					this.$el.remove();
					this._destory();
				},
				_init : function() {
					this._template = html;
					this.$el = $(this._template).appendTo('body');
				}
			});

})(UI, jQuery, '<div class="modal-backdrop fade in"></div>');