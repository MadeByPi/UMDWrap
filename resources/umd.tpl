(function(root, factory, console) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define([], function() { 
		::if haveExports::
			var exports = {};
			factory(console, exports); 
			return exports; 
		::else::
			factory(console);
		::end::
		});
::if haveExports::
	} else if (typeof exports === 'object') {
        factory(console, exports);
::end::
	} else {
		factory(console::if haveExports::, root::end::);
	}
})
(this, ::factoryCode::, typeof console != "undefined" ? console : {log:function(){}});