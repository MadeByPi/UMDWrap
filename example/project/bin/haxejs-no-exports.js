(function (console) { "use strict";
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
})(typeof console != "undefined" ? console : {log:function(){}});
