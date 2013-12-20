(function($){
	/**
	 * 	自定义局部变量命名通则:
	 *  ($*)  : this/$(element)即元素的jQuery对象;
	 *  (_*)  : 基本类型;
	 *  (_O*) : {};
	 *  (_F*) : Function;
	 *  (_A*) : Array;
	 *  (_$*) : 可能是基本类型/{}/fn/[]
	 */
	$.validator = function(options, $form) {
		this.settings = $.extend({}, $.validator.defaults, options);
		this.$form = $form;
		this.init();
	};
	$.extend($.validator, {
		defaults: {
			titles: {},
			messages: {},
			rules: {},
			offsets: {},
			event: {
				events: "focus blur",
				methods: {
					onfocus: function(element){
						var $this = this;
						$this.tip.normal.call($this, element, $this.msg.normal.call($this, element));
					},
					onblur: function(element){
						var $this = this;
						$this.check(element);
					}
				}
			}
		},
		lang: "zh_CN",
		//log switch
		debug: true,
		messages: {
			defaults: {
				normal: "please input normal tip.",
				required: "please input required tip.",
				regex: "please input regularity tip.",
				email: "please input email tip.",
				digit: "please input digit tip",
				length: "please input max byte length tip.",
				compare: "please input compare tip.",
				compareCurTime: "please input compare tip.", 
				cascade: "please input cascade tip.",
				remote: "please input remote tip."
			},
			//
			customizes: {
				zh_CN: {
					normal: "{0} ",
					required: "{0}不能为空",
					regex: "please input regularity tip.",
					email: "",
					digit: "",
					length: "please input max byte length tip.",
					compare: "please input compare tip.",
					compareCurTime: "", 
					cascade: "",
					remote: ""
				}
			}
		},
		rules: [ 'required', 'regex', 'email', 'digit', 'length', 'compare', 'compareCurTime', 'cascade', 'remote' ].join(' '),
		css: {
			normal : 'tip-zindex icon-note tip-note',
			successed : 'tip-zindex icon-yes',
			failed : 'tip-zindex tip-wrong icon-no',
			info : 'tip-info'
		},
		compatible: {
			tagMsgAttrs: {
				required: "requireTip",
				regex: "regexTip",
				email: "regexTip",
				digit: "regexTip",
				length: "maxByteLengthTip",
				compare: "compareTip",
				compareCurTime: "compareTip", 
				cascade: "ajaxTip",
				remote: "ajaxTip"
			},
			tagRuleAttrs: {
				regex: "regExp",
				length: "maxByteLength",
				compare: "compareObjID",
				remote: "ajaxUrl"
			}
		},
		format: function(source, params) {
			if ( arguments.length == 1 ) 
				return function() {
					var _Aargs = $.makeArray(arguments);
					_Aargs.unshift(source);
					return $.format.apply( this, _Aargs );
				};
			if ( arguments.length > 2 && params.constructor != Array  ) {
				params = $.makeArray(arguments).slice(1);
			}
			if ( params.constructor != Array ) {
				params = [ params ];
			}
			$.each(params, function(i, n) {
				source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
			});
			return source;
		},
		clean: function($selector) {
			return $selector[0];
		},
		contains: function(container, contained){
			var _AsubArr = contained.split(' '), _subLength = _AsubArr.length;
			if(_subLength == 1){
				return container.indexOf(contained) > -1;
			}
			var _contain = false;
			$.each(_AsubArr, function(i, str){
				_contain = container.indexOf(str) > -1;
				return !_contain;
			});
			return _contain;
		},
		log: function(msg) {
			if($.validator.debug){
				window.console.log(msg);
			}
			return msg;
		}
	});
	$.extend($.validator, {
		prototype: {
			init: function() {
				var $this = this;
				//bind
				$this.validElements().delegate(this, $this.settings.event.events, function(event){
					$this.settings.event.methods['on' + event.type] && $this.settings.event.methods['on' + event.type].call($this, this);
				});
			},
			validElements: function() {
				var $this = this;
				return $this.$form.find(":input:visible").filter(function(i){
					return !$this.isInvalid(this);
				});
			},
			check: function(element) {
				var $this = this,
					_$rules = $this.settings.rules[element.name],
					_required = $this.isRequired(element),
					_optional = $this.isOptional(element),
					_tagRules = $(element).attr("className"),
					//The function of User-defined 
					_FcheckAll = function(rules){
						var _length = rules.length,
							_isObj = _length === undefined || jQuery.isFunction( rules ),
							_FisRequired = function(rule){
								return rule === "required";
							},
							_r = true, 
							_$result = {result: true};
						$.each(rules, function(key, value) {
							var _rule = _isObj ? $.trim(key) : $.trim(value);
							$.validator.log("_rule[" + $.trim(key) + "]:" + _rule);
							
							//Check the element by user-defined rules.
							if($.isFunction(value)) {
								_r = value.call(value, $.trim(element.value), element);
							} 
							//Check the element by all rules.
							else if(!_FisRequired(_rule) && $this.rule.methods[_rule]) {
								_r = $this.rule.methods[_rule].call($this, $.trim(element.value), element, value);
								$.validator.log("_r:" + _r);
						 	}
						 	if(!_r){
						 		_$result = {rule: _rule, result: _r};
						 	}
							return _r;
						});
						return _$result;
				   },
				   _result = {rule: "required", result: false};
				   
				//1) Hide tip: It's not required. && The value of field is empty. 
				if(!(_required || _optional)) {
					$this.tip.removeTip.call($this, element);
					return;
				}
				
				//2) Hide tip: The field is not empty and it's no rules with defined constructor and defined tag.
				if(!(_$rules || (_tagRules && $.validator.contains($.validator.rules, _tagRules)))) {
					$this.tip.removeTip.call($this, element);
					return;
				}
				
				//3) When the field is not empty
				if(_optional) {
					//1.The rules are from the {} of constructor
					if($.isPlainObject(_$rules)) {
						_result = _FcheckAll(_$rules);
					}
					//2.The rules are from the string of constructor
					else if(_$rules && $.validator.contains($.validator.rules, _$rules)) {
						_result = _FcheckAll([_$rules]);
					}
					//3.The rules are from the defined class of tag
					else {
						_result = _FcheckAll(_tagRules.split(' '));
					}
				}
				
				//4) return the successed tip or the failed tip.
				if(_result.result) {
					$this.tip.successed.call($this, element);	
				}
				else {
					$this.tip.failed.call($this, element, $this.msg.getMsg.call($this, element, _result.rule, function(element){
						return $(element).attr($.validator.compatible.tagMsgAttrs[_result.rule]);
					}));
				}
			},
			isOptional: function(element){
				return this.rule.methods.required.call(this, $.trim(element.value), element);
			},
			isRequired: function(element){
				var _REQUIRED = "required",
					_$rules = this.settings.rules[element.name],
					_required = $.isPlainObject(_$rules) ? _$rules[_REQUIRED] === true : _$rules === _REQUIRED,
					_rules4Tag;
				return _required || ((_rules4Tag = $(element).attr("className")) && $.validator.contains(_rules4Tag, _REQUIRED));
			},
			isInvalid: function(element) {
				var _INVALID = "invalid",
					_$rules = this.settings.rules[element.name], 
					_invalid = $.isPlainObject(_$rules) ? _$rules[_INVALID] === true : _$rules === _INVALID;
				return _invalid || $(element).attr(_INVALID) === "true";
			},
			rule: {
				methods: {
					required: function(value, element) {
						return value.length > 0;
					},
					cascade: function(value, element, args) {
						var $this = this, _result = "",
							_compareAttr = $.validator.compatible.tagRuleAttrs["compare"],
							_compareID = (typeof args != "string") && args[_compareAttr] ? args[_compareAttr] : $(element).attr(_compareAttr),
							$compare = _compareID ? $("#" + _compareID) : undefined;
							
						if($compare) {
							args = "cascade" !== args ? ((typeof args == "string" && {url : args}) || args) : {};
							
							var _data = {};
							_data[$compare.attr("name")] = $compare.val();
							args.data = $.extend({}, args.data, _data);
							
							_result = $this.rule.methods.remote.call($this, value, element, args);
						}
						else {
							_result = $.validator.log("[" + element.name + "]: is not specified comparison object.")
						}
						
						return _result;
					},
					remote: function(value, element, args) {
						var _result = "",
							_rometeAttr = $.validator.compatible.tagRuleAttrs["remote"],
							_$url = (_url4Tag = $(element).attr(_rometeAttr)) && {url : _url4Tag};
						
						if(args && "remote" !== args) {
							if(typeof args == "string") {
								args = {url : args};
							}
							else if($.isPlainObject(args) && !args.url) {
								$.extend(args, _$url);
							}
						}
						else {
							args = _$url;
						}
						
						if(args.url) {
							var _data = {};
							_data[element.name] = value;
							if(args.data) {
								$.extend(args.data, _data);
							}
							_result = $.ajax($.extend(true, {
								url : "",
								data : _data,
								type : "POST",
								cache : false,
								async : false
							}, args)).responseText == "true";
						}
						else{
							_result = $.validator.log("[" + element.name + "]: is not specified AJAX request url.")
						}
						return _result;
					},
					length: function(value, element, length) {
						var $this = this,
							_length4Tag = $(element).attr($.validator.compatible.tagRuleAttrs["length"]),
							_FisDigit = function(args){
								return $this.rule.methods.digit.call($this, args);
							};
						return  _FisDigit(length) || (_length4Tag && _FisDigit(_length4Tag) && (length = _length4Tag)) ? 
											value.replace(/[^\x00-\xff]/g, "***").length < length : $.validator.log("[" + element.name + "]: is not specified limit length.");
					},
					compare: function(value, element, compare) {
						var _compareID4Tag = $(element).attr($.validator.compatible.tagRuleAttrs["compare"]),
						    _FisUndefined = function(value) {
						    	return undefined !== value;
						    }
						    _compareValue = "";
						return ("compare" !== compare && (_FisUndefined(_compareValue = $(compare).val()) || compare)) 
								|| _FisUndefined(_compareValue = $("#" + _compareID4Tag + "_ID").val()) 
								? value === _compareValue : $.validator.log("[" + element.name + "]: is not specified comparison object.");
					},
					regex: function(value, element, regex) {
						var _regex4Tag = $(element).attr($.validator.compatible.tagRuleAttrs["regex"]),
							_FisRegex = function (regex){
								return regex && /^\/(.)*\/$/.test(regex);
							};
						return _FisRegex(regex) || (_regex4Tag && (regex = new RegExp(_regex4Tag, 'g'))) ? regex.test(value) : $.validator.log("[" + element.name + "]: is not specified regular expressions.");
					},
					email: function(value, element) {
						var _regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
						return _regex.test(value);
					},
					digit: function(value, element) {
						var _regex = /^[\d]+$/;
						return _regex.test(value);
					},
					url: function(value, element) {
						var _regex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
						return _regex.test(value);
					},
					compareCurTime: function(value, element) {
						//匹配下时间格式，并把年月日时分秒设置到全局RegExp对象里
						var _A = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/.exec(value),
							_year = RegExp.$1, _month = RegExp.$2 - 1, _day = RegExp.$3,
							_hour = RegExp.$4, _minute = RegExp.$5, _second = RegExp.$6,
							_compare = new Date(_year, _month, _day, _hour, _minute, _second),
							_now = new Date();
						return _compare.getTime() > _now.getTime();
					}
				}
			},
			tip: {
				tipID: function(element) {
					return element.id + "_dynamicID";
				},
				normal: function(element, msg) {
					var $this = this;
					$this.tip.createTip.call($this, element, "normal", msg);
				},
				successed: function(element, msg) {
					var $this = this;
					$this.tip.createTip.call($this, element, "successed", msg);
				},
				failed: function(element, msg) {
					var $this = this;
					$this.tip.createTip.call($this, element, "failed", msg);
				},
				createTip: function(element, type, msg) {
					var $this = this, 
						_id = $this.tip.tipID(element),
					    _tipClazz = $.validator.css[type],
					    _msgClazz = $.validator.css['info'],
					    //The function of User-defined 
					    _Foffset = function(ele) {
					    	var _elementName = ele.name, $offset = $this.settings.offsets[_elementName];
					    	if($.isPlainObject($offset)){
					    		return $offset;
					    	}
					    	var $eleObj = $(ele), _width = $eleObj.width(), offset = $eleObj.offset(), 
					    		//Compatible with older components
					    		_marginLeft = $eleObj.attr("tipMarginLeft"), 
							    _top = offset.top, _left = offset.left + _width + 15 + (_marginLeft ? parseInt(_marginLeft) : 0) ;
					    	return {top : _top, left : _left};
					    },
					    $tipDiv = $("#" + _id);
					    
					if(!$.validator.clean($tipDiv)){
						$tipDiv = $('<div>').attr("id", _id).offset(_Foffset(element)).insertAfter($(element));
					}
					$tipDiv.removeClass().addClass(_tipClazz).html($('<div>').addClass(_msgClazz).text(msg));
				},
				removeTip: function(element) {
					var _id = this.tip.tipID(element);
					$("#" + _id).remove();
				}
			},
			msg: {
				normal: function(element) {
					var $this = this;
					return $this.msg.getMsg.call($this, element, "normal", function(element){
						//Compatible with older components
						return $(element).attr('normalTip');
					});
				},
				getMsg: function(element, ruleName, fn) {
					var $this = this, 
					    _elementName = element.name,
						_Omsgs = $this.settings.messages[_elementName],
						_OcustomMsgs = $.validator.messages.customizes[$.validator.lang],
						_elementTitle = $this.settings.titles[_elementName],
						_normalMsg = '';
					
					//1. constructor [private]
					if($.isPlainObject(_Omsgs) && (_normalMsg = _Omsgs[ruleName])){
						//console.log("constructor");
						return _normalMsg;
					}
					//2.customize
					if(_elementTitle && (_normalMsg = $.validator.format(_OcustomMsgs[ruleName], _elementTitle))){
						//console.log("customize");
						return _normalMsg;
					}
					//3.tag [private]
					if(fn && (_normalMsg = fn.call($this, element))){
						//console.log("tag" + " " + _normalMsg);
						return _normalMsg;
					}
					//4.default
					//console.log("default");
					return _normalMsg = $.validator.messages.defaults[ruleName];
				}
			}
		}
	});
	
	/**
	 * 
	 */
	$.extend($.fn, {
		validate: function(options) {
			var key = "UD_Validator", 
				validator = $.data(this[0], key);
			if(!validator){
				validator = new $.validator(options, this);
				$.data(this[0], key, validator);
			}
			return validator;
		}
	});
})(jQuery);

$(function($){
	$("form").each(function(i, form){
		$(form).validate({
			rules: {
				"terminalModel.code":{
					"required": true,
					"regex": "",
					"remote":""
				}
			}
//			titles:{
//				"terminalModel.code":"title show!"
//			}
//			messages: {
//				"terminalModel.code": {
//					normal: "oh, yeah!"
//				}
//			}
		});
	});
});