package ;

import js.Lib;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

@:expose('tests.Main')
class Main {
	
	static var instance:Main;
	
	static function main() {
		trace('Entry point');
		instance = new Main();
	}
	
	function new() {
		trace('I\'m new!');
	}
	
	public function test() {
		trace('Here I am!');
	}
	
	@:expose('moretests.anotherTest')
	static function anotherTest() {
		trace('Really?');
	}
}