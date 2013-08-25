var Util = {};

// utils.js
(function($) {
	var core_version = "2.0.1",
	// [[Class]] -> type pairs
	class2type = {}, core_toString = class2type.toString, core_trim = core_version.trim, core_hasOwn = class2type.hasOwnProperty;

	$.extend = function() {
		var options, name, src, copy, copyIsArray, clone, target = arguments[0]
				|| {}, i = 1, length = arguments.length, deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep
		// copy)
		if (typeof target !== "object" && !$.isFunction(target)) {
			target = {};
		}

		// extend $ itself if only one argument is passed
		if (length === i) {
			target = this;
			--i;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep
							&& copy
							&& ($.isPlainObject(copy) || (copyIsArray = $
									.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && $.isArray(src) ? src : [];

						} else {
							clone = src && $.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = $.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	$.extend({
				// See test/unit/core.js for details concerning isFunction.
				// Since version 1.3, DOM methods and functions like alert
				// aren't supported. They return false on IE (#2968).
				isFunction : function(obj) {
					return $.type(obj) === "function";
				},

				isGlobal : function(obj) {
					return obj != null && obj === obj.global;
				},

				isNumeric : function(obj) {
					return !isNaN(parseFloat(obj)) && isFinite(obj);
				},

				type : function(obj) {
					if (obj == null) {
						return String(obj);
					}
					// Support: Safari <= 5.1 (functionish RegExp)
					return typeof obj === "object" || typeof obj === "function"
							? class2type[core_toString.call(obj)] || "object"
							: typeof obj;
				},

				isPlainObject : function(obj) {
					// Not plain objects:
					// - Any object or value whose internal [[Class]] property
					// is not "[object Object]"
					// - DOM nodes
					// - window
					if ($.type(obj) !== "object" || obj.nodeType
							|| $.isWindow(obj)) {
						return false;
					}

					// Support: Firefox <20
					// The try/catch suppresses exceptions thrown when
					// attempting to access
					// the "constructor" property of certain host objects, ie.
					// |window.location|
					// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
					try {
						if (obj.constructor
								&& !core_hasOwn.call(obj.constructor.prototype,
										"isPrototypeOf")) {
							return false;
						}
					} catch (e) {
						return false;
					}

					// If the function hasn't returned already, we're confident
					// that
					// |obj| is a plain object, created by {} or constructed
					// with new Object
					return true;
				},

				isEmptyObject : function(obj) {
					var name;
					for (name in obj) {
						return false;
					}
					return true;
				},
				error : function(msg) {
					throw new Error(msg);
				},
				noop : function() {
				},

				// args is for internal usage only
				each : function(obj, callback, args) {
					var value, i = 0, length = obj.length, isArray = isArraylike(obj);

					if (args) {
						if (isArray) {
							for (; i < length; i++) {
								value = callback.apply(obj[i], args);

								if (value === false) {
									break;
								}
							}
						} else {
							for (i in obj) {
								value = callback.apply(obj[i], args);

								if (value === false) {
									break;
								}
							}
						}

						// A special, fast, case for the most common use of each
					} else {
						if (isArray) {
							for (; i < length; i++) {
								value = callback.call(obj[i], i, obj[i]);

								if (value === false) {
									break;
								}
							}
						} else {
							for (i in obj) {
								value = callback.call(obj[i], i, obj[i]);

								if (value === false) {
									break;
								}
							}
						}
					}

					return obj;
				},

				trim : function(text) {
					return text == null ? "" : core_trim.call(text);
				},

				// A global GUID counter for objects
				guid : 1,

				// Bind a function to a context, optionally partially applying
				// any
				// arguments.
				proxy : function(fn, context) {
					var tmp, args, proxy;

					if (typeof context === "string") {
						tmp = fn[context];
						context = fn;
						fn = tmp;
					}

					// Quick check to determine if target is callable, in the
					// spec
					// this throws a TypeError, but we will just return
					// undefined.
					if (!$.isFunction(fn)) {
						return undefined;
					}

					// Simulated bind
					args = core_slice.call(arguments, 2);
					proxy = function() {
						return fn.apply(context || this, args.concat(core_slice
										.call(arguments)));
					};

					// Set the guid of unique handler to the same of original
					// handler, so it can be removed
					proxy.guid = fn.guid = fn.guid || $.guid++;

					return proxy;
				},
				now : Date.now,

				// A method for quickly swapping in/out CSS properties to get
				// correct calculations.
				// Note: this method belongs to the css module but it's needed
				// here for the support module.
				// If support gets modularized, this method should be moved back
				// to the css module.
				swap : function(elem, options, callback, args) {
					var ret, name, old = {};

					// Remember the old values, and insert the new ones
					for (name in options) {
						old[name] = elem.style[name];
						elem.style[name] = options[name];
					}

					ret = callback.apply(elem, args || []);

					// Revert the old values
					for (name in options) {
						elem.style[name] = old[name];
					}

					return ret;
				}
			});

	$.each(	"Boolean Number String Function Array Date RegExp Object Error"
					.split(" "), function(i, name) {
				class2type["[object " + name + "]"] = name.toLowerCase();
			});

	function isArraylike(obj) {
		var length = obj.length, type = $.type(obj);

		if ($.isGlobal(obj)) {
			return false;
		}

		if (obj.nodeType === 1 && length) {
			return true;
		}

		return type === "array"
				|| type !== "function"
				&& (length === 0 || typeof length === "number" && length > 0
						&& (length - 1) in obj);
	}

})(Util);

module.exports = Util;
