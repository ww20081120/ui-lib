// m2m.ui.ajaxwidget-2.0.1.js
(function(exports, $, html) {
	exports.Dialog = Dialog;

	// title,content,model,display,closeable
	var _opt = {
		title : 'Message Window',
		display : true,
		closeable : true,
		buttonGroup : [{
					clazz : 'btn btn-primary',
					text : 'Close'
				}]
	}, _event = {
		show : 'show',
		hide : 'hide',
		close : 'close'
	}, _version = '0.1.0',
	// clazz,attr,text,event,eventType
	_btnOpt = {
		eventType : 'click'
	}, _createBtn = function(opt) {
		opt = $.extend(_btnOpt, opt || {})
		var $btn = $('<button/>').text(opt.text).addClass(opt.clazz);
		if (opt.event) {
			$btn.on(opt.eventType, opt.event);
		}
		if (opt.attr) {
			$.each(opt.attr, function(name, value) {
						$btn.attr(name, value);
					});
		}
		return $btn;
	};

	// ajax 组件的父类
	function Dialog(options) {
		exports.Widget.call(this, options, _version);
		$.extend(this.settings, _opt, options || {});
	}

	$.extend(Dialog.prototype, new exports.Widget(), {
		isDisplay : function() {
			return this.settings.display;
		},
		show : function() {
			this.settings.display = true;
			this.$el.show();
			this._emit(_event.show);
		},
		hide : function(ms) {
			var self = this;
			if (ms) {
				setTimeout(function() {
							self.hide();
						}, ms);
				return this;
			}
			this.settings.display = false;
			this.$el.hide();
			this._emit(_event.hide);
		},
		close : function() {
			this.$el.remove();
			this._emit(_event.close);
			this._destory();
		},
		_closeAble : function($header) {
			var self = this;
			if (this.settings.closeable) {
				$header.prepend(_createBtn({
							clazz : 'close',
							text : '×',
							event : function() {
								self.close();
							}
						}));
			}
			return this;
		},
		_modelAble : function() {
			if (this.settings.model && exports.overlay) {
				this._overlay = exports.overlay();
				this.on(_event.hide, function() {
							this._overlay.hide();
						}).on(_event.show, function() {
							this._overlay.show();
						}).on(_event.close, function() {
							this._overlay.close();
						})
			}
			return this;
		},
		_init : function() {
			this._template = html;
			this.$el = $(this._template);
			this._render();
			var self = this;
			function display() {
				if (self.settings.display) {
					self.show();
				} else {
					self.hide();
				}
			}
			if (this.settings.model && this._overlay) {
				this._overlay.on('init', display);
			} else {
				display();
			}
		},
		_render : function() {
			var $el = this.$el, self = this, $header = $el
					.find('.modal-header'), $body = $el.find('.modal-body'), $footer = $el
					.find('.modal-footer');

			$header.append($('<h4/>').addClass('modal-title')
					.text(self.settings.title));

			self._closeAble($header)._modelAble();

			$body.html(self.settings.content);
			$el.appendTo('body');

			if (this.settings.buttonGroup) {
				$.each(this.settings.buttonGroup, function(index, btn) {
							$footer.append(_createBtn(btn));
						});
			}

			return this;
		}
	});

})(
		UI,
		jQuery,
		'<div class="modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"></div><div class="modal-body">Hello world</div><div class="modal-footer"></div></div></div></div>');