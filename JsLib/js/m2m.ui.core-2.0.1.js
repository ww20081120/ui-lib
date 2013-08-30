// m2m.ui.core-0.1.0.js
var UI = {};

// widget
(function(exports, $) {
	exports.Widget = Widget;

	var _option = {}, _event = {
		init : 'init',
		destory : 'destory'
	}, _version = '2.0.1';

	// m2m.ui 的父类
	function Widget(options, version) {
		var deferred = $.Deferred();
		deferred.promise(this);

		// 配置参数
		this.settings = $.extend({}, _option, options || {});
		this._version = version || _version;
		// 事件注册
		this.callbacks = {};

		$($.proxy(function() {
					try {
						this._call('_init', _event.init);
						deferred.resolve()
					} catch (e) {
						deferred.reject(e);
					}
				}, this));
	}

	// 添加方法
	$.extend(Widget.prototype, {
		getVersion : function() {
			return this._version;
		},
		on : function(events, fn) {
			events = events.split(" ");
			for (var i = 0; i < events.length; i++) {
				(this.callbacks[events[i]] = this.callbacks[events[i]] || [])
						.push(fn);
			}
			return this;
		},
		once : function(event, fn) {
			var on = $.proxy(function() {
						this.off(event, on);
						fn.apply(this, arguments);
					}, this);
			this.on(event, on);
			return this;
		},
		off : function(events, fn) {
			events = events.split(" ");
			for (var i = 0; i < events.length; i++) {
				var callbacks = this.callbacks[events[i]];
				if (!callbacks)
					continue;

				// remove all handlers
				if (1 == arguments.length) {
					delete this.callbacks[events[i]];
					continue;
				}

				// remove specific handler
				var index = callbacks.indexOf(fn);
				callbacks.splice(index, 1);
			}
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
		_call : function(method, event) {
			if ($.isFunction(this[method])) {
				var args = [].slice.call(arguments, 2);
				this[method].apply(this, args);
				if (event) {
					this._emit(event);
				}
			}
		},
		_destory : function() {
			this._emit(_event.destory);
			var self = this;
			$.each(self, function(el) {
						delete self[el];
					});
		}
	});
})(UI, jQuery);