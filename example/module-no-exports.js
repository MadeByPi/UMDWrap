(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	 } else {
		// Call the factory
		factory();
	}
}(this, function () { "use strict";
var Main = function() {
	console.log("I'm new!");
};
Main.main = function() {
	console.log("Entry point");
	Main.instance = new Main();
};
Main.anotherTest = function() {
	console.log("Really?");
};
Main.prototype = {
	test: function() {
		console.log("Here I am!");
	}
};
Main.main();
}));