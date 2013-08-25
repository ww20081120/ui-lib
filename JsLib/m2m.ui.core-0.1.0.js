// m2m.ui.core-0.1.0.js

var m2m = {}, Utils = require('./m2m.ui.utils-0.1.0');

// widget
(function(exports, $) {

	exports.Widget = Widget;

	var _option = {
		version : '0.1.0'
	};

	// m2m.ui 的子类
	function Widget(options) {
		// 配置参数
		this.settings = $.extend(_option, options || {});

		// 事件注册
		this.callbacks = {};
		if(this.init){
			this.init();
			this.emit('init');
		}
	}

	// 添加方法
	$.extend(Widget.prototype, {
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
		emit : function(event) {
			var args = [].slice.call(arguments, 1), callbacks = this.callbacks[event];

			if (callbacks) {
				for (var i = 0, len = callbacks.length; i < len; ++i) {
					callbacks[i].apply(this, args);
				}
			}

			return this;
		}

	});

})(m2m, Utils);