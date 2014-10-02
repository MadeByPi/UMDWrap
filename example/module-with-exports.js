(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define([], function() { var exports={}; factory(exports); return exports; });
	 } else if (typeof exports === 'object') {
		// CommonJS
        factory(exports);
	 } else {
		// Browser globals
		factory(root);
	}
}(this, function ($hx_exports) { "use strict";
$hx_exports.moretests = $hx_exports.moretests || {};
$hx_exports.tests = $hx_exports.tests || {};
var Main = $hx_exports.tests.Main = function() {
	console.log("I'm new!");
};
Main.main = function() {
	console.log("Entry point");
	Main.instance = new Main();
};
Main.anotherTest = $hx_exports.moretests.anotherTest = function() {
	console.log("Really?");
};
Main.prototype = {
	test: function() {
		console.log("Here I am!");
	}
};
Main.main();
}));