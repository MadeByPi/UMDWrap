(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define([], ::if haveExports::function() { var exports={}; factory(exports); return exports; }::else::factory::end::);
	::if haveExports:: } else if (typeof exports === 'object') {
		// CommonJS
        factory(exports);
	::end:: } else {
		// ::if haveExports::Browser globals::else::Call the factory::end::
		factory(::if haveExports::root::end::);
	}
}(this, ::factoryCode::));