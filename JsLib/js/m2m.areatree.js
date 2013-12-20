(function($){
	var areaTree = function(options){
		var defaults = {
				support : {
					container : '',
					hiddenAttr : 'hiddenValue',
					defaultValue : '',
					fn : ''
				},
				dataSetting : {
					fields : {
						id : "id",
						text : "areaName",
						pid : "parentId",
						type : "typeCode"
					},
					level : {
						one : '0001',
						two : '0002',
						three : '0003',
						four : '0004'
					},
					top : '0',
					//数据加载URL
					url : ''
				},
				css : {
					wrap : "site_all",
					country : "country site_all_bg",
					province : "state statebg",
					city : "city site_all_bg",
					title : "site_tile",
					selected : "selected",
					btnDiv : "are_button",
					btnSpan : "are_sure"
				}
		},
		cache = {
				//弹出层对象
				popup : "",
				hideFlag : 0,
				isRedraw : false,
				dataSetting : {
					// 数据格式：{id : [name, typeCode, pid] }
					textCache : {},
					
					// 数据格式：{id : [id1, id2]}
					memberCache : {}
				}
		},
		opts = $.extend(true, defaults, cache, options),
		_this = this,
		dataLoad = {
			getData : function(id){
				var _setting = opts.dataSetting,
					_memberCache = _setting.memberCache;
				
				return _memberCache[id];
			},
			requestData : function(){
				var url  = opts.dataSetting.url;
				if(url){
					var _defaluts = {
							type : "POST",
							url : url,
							//ajax 数据同步
							async : false,
							dataType : "json",
							success : function(data){
								_this.clearCache();
								_this.parseData(data);
							}
						};
					
					$.ajax(_defaluts);
				}
			},
			parseData : function(data){
				var _setting = opts.dataSetting,
					_textCache = _setting.textCache,
					_memberCache = _setting.memberCache,
					_field = _setting.fields,
					_indxID = _field.id,
					_indxText = _field.text,
					_indxPID = _field.pid,
					_indxType = _field.type,
					data = data ? eval(data) : {};
					
				$.each(data, function(i, json){
					var id = json[_indxID], text = json[_indxText], pid = json[_indxPID], type = json[_indxType];
					_textCache[id] = [text, type, pid];
					if(!_memberCache[pid]){
						_memberCache[pid] = [id];
					}
					else{
						_memberCache[pid].push(id);
					}
				});
			},
			clearCache : function(){
				var _data = opts.dataSetting;
				_data.textCache = {};
				_data.memberCache = {};
			}
		},
		assembleDom = {
			/**
			 * data : 国家或省份或城市 数据
			 * wrap : 最外层DIV
			 */
			subHtmlHanlder : function(data, wrap, isInsert){
				if(data){
					var _dataLevel = opts.dataSetting.textCache[data[0]][1], 
						_htmlJSON = _this.getSubHtml(_dataLevel), 
						_html = _htmlJSON.html,
						_isNew = _htmlJSON.isNew,
						_div = $("<div>"),
						getSelected = function(dataLevel){
							var _support = opts.support,
								_selectedID = _support.container.attr(_support.hiddenAttr);
							
							if(_selectedID){
								var level = opts.dataSetting.level,
								 	selectedObj = opts.dataSetting.textCache[_selectedID],
									_selectedLevel = selectedObj[1];
									_selectedPID = selectedObj[2];
									
								if(level.one == dataLevel){
									var pSelectedObj = opts.dataSetting.textCache[_selectedPID];
									_selectedID = (level.three == _selectedLevel || level.four == _selectedLevel) ? pSelectedObj[2] : _selectedPID;
								}else if (level.two == dataLevel){
									_selectedID = (level.three == _selectedLevel || level.four == _selectedLevel) ? _selectedPID : _selectedID;
								}
							}
						
							return _selectedID;
						},
						_selectedID = getSelected(_dataLevel);
						
					$.each(data, function(i, id){
						var level = opts.dataSetting.level,
							arr = opts.dataSetting.textCache[id],
							_text = arr[0],
							_level = arr[1],
							_a = $("<a>").text(_text),
							_isExtend = false;
						
						_isExtend = _selectedID ? (_selectedID == id) : (i == 0) && (level.one == _dataLevel || level.two == _dataLevel);
						
						if(_isExtend){
							_a.addClass(opts.css.selected);
							_this.subHtmlHanlder(_this.getData(id), wrap, isInsert);
						}
						
						_this.attachEvents(_a, id, _text, _level);
						_div.append(_a);
					});
					
					_html.append(_div);
					
					if(isInsert){
						if(_isNew){
							$.each(wrap.children(), function(i, el){
								if(i == 1){
									_html.insertAfter($(el));
								}
							});
						}
					}
					else{
						wrap.prepend(_html);
					}
				}	
			},
			getSubHtml : function(level){
				var _html = '',
					_level = opts.dataSetting.level,
					_curSubHtml = function(clazz){
						var popup = opts.popup,
							_obj = '';
						if(popup){
							$.each(popup.children(), function(i, el){
								if(el.className.indexOf(clazz) > -1){
									_obj = $(el);
									_obj.children().last().remove();
								}
							});
						}
						return _obj;
					},
					_subHtml = function(clazz, text){
						var _div = _curSubHtml(clazz),
							isNew = false;
						if(!_div){
							_div = $("<div>").addClass(clazz);
							_div.append($("<span>").addClass(opts.css.title).text(text));
							isNew = true;
						}
						return {html : _div, isNew : isNew};
					};
			
				if(_level.one === level){
					_html = _subHtml(opts.css.country, "国家");
				}
				else if(_level.two === level){
					_html = _subHtml(opts.css.province, "省份");
				}
				else{
					_html = _subHtml(opts.css.city, "城市");
				}
				return _html;
			},
			attachEvents : function(){
				var _a = arguments[0], 
					id = arguments[1],
					text = arguments[2],
					type = arguments[3];
				
				$.each(_this.events, function(i, event){
					_a.bind(event, function(){
						_this.methods["on" + event].call(_this, _a, id, text, type);
					});
				});
			},
			btnHtmlHandler : function(){
				var	_div = $("<div>").addClass(opts.css.btnDiv),
					_span = $("<span>").addClass(opts.css.btnSpan),
					_a = $("<a>").text("取消");
				_a.bind("click", function(){
					_this.cancleBtnHandler.call(_this, _a);
				});
				return _div.append(_span.append(_a));
			},
			cancleBtnHandler : function(){
				var _support = opts.support,
					_hidden = _support.container.prev("input[type='hidden']");
				if(_hidden){
					_hiddenName = _hidden.attr("name");
					_hidden.remove();
					_support.container.attr("name", _hiddenName);
				}
				_support.container.val("").removeAttr(_support.hiddenAttr).focus();
				
				opts.isRedraw = true;
				_this.hide();
			},
			getWrap : function(){
				var _subHtml = function(clazz, text ){
						var _div = $("<div>").addClass(clazz), 
							_span = $("<span>").addClass(opts.css.title).text(text);
						return _div.append(_span);
					},
					outer = $("<div>").addClass(opts.css.wrap).attr("id", "popupID");
					
				_this.setTreePosition(outer);
				_this.subHtmlHanlder(_this.getData(opts.dataSetting.top), outer);
				outer.append(_this.btnHtmlHandler());
				outer.append('<iframe style="z-index:-100; background:#f4f4f4; position: absolute; top:0; min-height:250px; _height:220px;" width="333" ></iframe>');
				return outer;
			},
			setTreePosition : function($tree){
				var $container = opts.support.container,
					$offset = $container.offset(), 
					_height = $container.height(),
					_top = $offset.top, _left = $offset.left;
				$tree.offset({top: (_top + _height + 2), left: _left});
			}
		},
		event = {
			events : ["click" ],
			methods : {
				onclick : function(aObj, id, text, type){
					var _level = opts.dataSetting.level,
						_data = _this.getData(id),
						_selected = opts.css.selected;
					if((_level.one == type || _level.two == type) && _data){
						_this.subHtmlHanlder(_data, opts.popup, true);
						aObj.siblings().removeClass(_selected);
						aObj.addClass(_selected);
					}else{
						_this.hide();
						var _support = opts.support;
						_support.container.val(text).attr(_support.hiddenAttr, id);
						if(_support.fn){
							_support.fn.call(_this, _support.container, aObj, id, text, type);
						}
					}
				}
			}
		},
		common = {
			build : function(){
				opts.popup = _this.getWrap();
				opts.popup.hide();
				opts.popup.insertAfter(opts.support.container); 
				opts.popup.bind('click', function() {
					_this.recorder();
				});
			},
			show : function(){
				var _container = opts.support.container;
				if(opts.isRedraw || _container.val()){
					opts.popup.remove();
					_this.build();
					opts.isRedraw = false;
				}
				opts.popup.show();
			},
			hide : function(isHideAttr){
				_this.recorder();
				
				window.setTimeout(function(){					
					if (opts.hideFlag % 2 == 1) {
						opts.hideFlag = 0;
						opts.popup.hide();
					}
				},1);
			},
			recorder : function(){
				opts.hideFlag ++;
			},
			initClickDomHide : function(){
				$('html').bind('click', function(){
					_this.hide();
				});
			},
			setContainerDefault : function(){
				var _support = opts.support,
					_container = _support.container,
					_hiddenAttr = _support.hiddenAttr,
					_defalutValue = _support.defaultValue ;
				if(_defalutValue){
					var text = opts.dataSetting.textCache[_defalutValue][0];
					_container.attr(_hiddenAttr, _defalutValue).val(text);
					if(_support.fn){
							_support.fn.call(_this, _support.container, null, _defalutValue, null, null);
					}
				}
			}
		},
		init = function(){
			var _setting = opts.dataSetting,
				_top = _setting.top;
			$.extend(_this, dataLoad);
			$.extend(_this, assembleDom);
			$.extend(_this, event);
			$.extend(_this, common);
			_this.requestData();
			_this.build();
			_this.initClickDomHide();
			_this.setContainerDefault();
		};
		
		init();
	};
	
	$.fn.showTree = function(options){
		if (!this.length) {
			return;
		}
		var _this = this, tree = $.data(_this, "UD_TREE");
		if (tree) {
			return tree;
		}
		
		var defaults = {
				support : {
					container : _this,
					fn : function(){
						var container = arguments[0], 
							id = arguments[2],
							_name = container.attr("name"),
							_hidden = '';
						
						if(_name.indexOf("_bak") <= -1){
							container.attr("name", "name_bak");
							_hidden = $(['<input type="hidden" name="', _name, '"/>'].join(""));
							_hidden.insertBefore(container);
						}
						else{
							_hidden = container.prev("input[type='hidden']");
						}
						_hidden.val(id);
						container.focus();
					}
				}
		},
		setting = $.extend(true, defaults, options);
		
		tree = new areaTree(setting);
		
		_this.bind('click', function(){
			tree.recorder();
			tree.show();
		});
		
		$.data(_this, "UD_TREE", tree);
		return tree;
	};
})(jQuery);