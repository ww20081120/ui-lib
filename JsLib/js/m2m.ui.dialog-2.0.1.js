// m2m.ui.ajaxwidget-2.0.1.js
(function(exports, $, html) {
	exports.Dialog = Dialog;

	// content,remote,display,effect,width,height
	var _opt = {
		effect : true
	}, _event = {
		show : 'show',
		hide : 'hide',
		close : 'close'
	}, _version = '2.0.1';

	// ajax 组件的父类
	function Dialog(options, template) {
		this.$element = $(template || html);
		exports.Widget.call(this, options, _version);
		$.extend(this.settings, _opt, options || {});
	}

	$.extend(Dialog.prototype, new exports.Widget(), {
		isDisplay : function() {
			return this.settings.display;
		},
		toggle : function() {
			return this[!this.isDisplay() ? 'show' : 'hide']()
		},
		show : function() {
			if (this.settings.display)
				return this;
			this.settings.display = true;
			this._emit(_event.show);

			this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $
							.proxy(this.close, this));

			if (!this.$element.parent().length)
				this.$element.appendTo(document.body)

			// 显示
			this.$element.show().addClass('in').attr('aria-hidden', false);

			return this;
		},
		hide : function() {
			if (!this.settings.display)
				return this;
			this.settings.display = false;
			this._emit(_event.hide);

			$(document).off('focusin.bs.modal');
			this.$element.hide().removeClass('in').attr('aria-hidden', true)
					.off('click.dismiss.modal');
		},
		close : function() {
			this._emit(_event.close);
			this.$element.remove();
			this._destory();
		},
		_modelAble : function() {
			if (exports.overlay) {
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
		_effectAble : function($dialog) {
			if (this.settings.effect) {
				this.on(_event.show, function() {
							$dialog.fadeIn();
						}).on(_event.hide, function() {
							$dialog.fadeOut();
						});
			}
			return this;
		},
		_init : function() {
			this._render();

			// 当overlay初始化好以后触发display
			$.when(this._overlay).done($.proxy(function() {
						this.settings.display = !this.settings.display;
						this.toggle();
					}, this));
		},
		_render : function() {
			var $element = this.$element, $title = $element
					.find('.modal-title'), $body = $element.find('.modal-body');

			if (this.settings.title) {
				$title.text(this.settings.title);
			}

			this.settings.remote ? $body.load(this.settings.remote) : $body
					.append(this.settings.content);

			return this._modelAble()
					._effectAble($element.find('.modal-dialog'));
		}
	});

})(
		UI,
		jQuery,
		'<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Modal Dialog</h4></div><div class="modal-body"></div><div class="modal-footer"><button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Close</button></div></div></div></div>');
