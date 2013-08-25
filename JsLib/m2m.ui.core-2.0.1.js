// m2m.ui.core-0.1.0.js
<<<<<<< HEAD:JsLib/m2m.ui.core-2.0.1.js
var UI = {}, Utils = require('./m2m.ui.utils-2.0.1');
=======

var UI = {}, Utils = require('./m2m.ui.utils-0.1.0');
>>>>>>> d3864d420889e9c1a00b848d98468406ef391913:JsLib/m2m.ui.core-0.1.0.js

// widget
(function(exports, $) {

	exports.Widget = Widget;

<<<<<<< HEAD:JsLib/m2m.ui.core-2.0.1.js
	var _option = {}, _event = {}, _version = '2.0.1';

	// m2m.ui 的父类
=======
	var _option = {}, _event = {}, _version = '0.1.0';

	// m2m.ui 的子类
>>>>>>> d3864d420889e9c1a00b848d98468406ef391913:JsLib/m2m.ui.core-0.1.0.js
	function Widget(options, version) {
		// 配置参数
		this.settings = $.extend(_option, options || {});
		this._version = version || _version;

		// 事件注册
		this.callbacks = {};
<<<<<<< HEAD:JsLib/m2m.ui.core-2.0.1.js

		this._call('_init');
=======
		if (this._init) {
			this._init();
		}
>>>>>>> d3864d420889e9c1a00b848d98468406ef391913:JsLib/m2m.ui.core-0.1.0.js
	}

	// 添加方法
	$.extend(Widget.prototype, {
		getVersion : function() {
			return this._version;
		},
		on : function(event, fn) {
			(this.callbacks[event] = this.callbacks[event] || []).push(fn);
			return this;
		},
		once : function(event, fn) {
			var self = this;

			function on() {
				self.off(event, on);
				fn.apply(this, arguments);
			}

			this.on(event, on);
			return this;
		},
		off : function(event, fn) {
			var callbacks = this.callbacks[event];
			if (!callbacks)
				return this;

			// remove all handlers
			if (1 == arguments.length) {
				delete this.callbacks[event];
				return this;
			}

			// remove specific handler
			var i = callbacks.indexOf(fn);
			callbacks.splice(i, 1);
			return this;
		},
		_emit : function(event) {
			var args = [].slice.call(arguments, 1), callbacks = this.callbacks[event];

			if (callbacks) {
				for (var i = 0, len = callbacks.length; i < len; ++i) {
					callbacks[i].apply(this, args);
				}
			}

			return this;
		},
		_call : function(method) {
			if ($.isFunction(this[method])) {
				var args = [].slice.call(arguments, 1);
				this[method].apply(this, args);
			}
		}
	});

})(UI, Utils);

module.exports = UI;