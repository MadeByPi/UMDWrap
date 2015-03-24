package ;

import haxe.Resource;
import haxe.Template;
import neko.Lib;
import sys.io.File;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 * 
 * Wrap up compiled Haxe JS output for use as a self-contained module compatible with UMD (Universal Module Definition) patterns
 * 
 * Fields you have exposed with the @:expose metadata are available in the module
 * 
 * Creates modules for AMD (requirejs) and CommonJS, and will expose any exports in a named global object if none of those options are available.
 * 
 * If needed, `nekotools boot UMDWrap.n` will create an executable version of the tool.
 * 
 * Based on the templates at https://github.com/umdjs/umd
 */

using Main.VarNameCheck;
using StringTools;

class Main {
	
	// NOTE: Any source mapping will be broken by this process - sourceMappingURL is removed from the end, and line numbers are shifted down by 15
	// NOTE: Apply this process post-build, before any minification or obfuscation
	// NOTE: These begin/end pairs depend on the format of the Haxe JS compiler not changing.... so can break easily.
	
	static var JSBegin 			= '(function (console';
	static var JSEnd 			= '})(typeof console != "undefined" ? console : {log:function(){}});';
	static var JSEndWithExports = '})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);';
	
	static function main() {
		Sys.println('UMDWrap');
		Sys.println('-------');
		
		// read commandline argument pairs
		var args = getArgumentPairs();
		var inName = args.get('-in');
		var outName	= args.get('-out');
		
		if (inName == null || outName == null) {
			Sys.println('ERROR: You have to specify the input.js and output.js');
			instructions();
		}
		
		inName 	= inName.trim();
		outName = outName.trim();
		
		Sys.println('Loading "$inName"');
		
		var outJS = null;
		var inJS = null;
		
		// load js
		try {
			inJS = File.getContent(inName).trim();
		} catch (err:Dynamic) {
			Sys.println('ERROR: Unable to read js file "$inName"');
			instructions();
		}
		
		inJS = checkJSOutput(inJS);
		
		// wrap
		if (inJS.startsWith(JSBegin)) { // haxe js output is (always?) wrapped in an anon closure
			if (inJS.endsWith(JSEnd)) { // have some exports
				outJS = wrapModule(inJS);
			} else if(inJS.endsWith(JSEndWithExports)) {
				outJS = wrapModule(inJS, true);
			}
		}
		
		// save wrapped output
		if (outJS != null) {
			Sys.println('Saving module to $outName');
			try {
				File.saveContent(outName, outJS);
			} catch (err:Dynamic) {
				Sys.println('ERROR: Unable to save module to $outName');
				instructions();
			}
		} else {
			Sys.println('ERROR: Unexpected JS in $inName - Was is compiled by Haxe?');
			instructions();
		}
		
		// done
		Sys.println('');
	}
	
	
	static function getArgumentPairs() {
		
		var args = Sys.args();
		var map = new Map<String,String>();
		
		while (args.length > 1) map.set(args.shift(), args.shift());
		
		return map;
	}
	
	
	// check and update 3.x js output to 3.2 style - with console wrapper
	static function checkJSOutput(js:String) {
		
		var begin31 = '(function (';
		var end31NoExports = '})();';
		var end31Exports = '})(typeof window != "undefined" ? window : exports);';
		var n;
		
		if (js.endsWith(end31NoExports)) { 
			n = js.length - end31NoExports.length;
			js = JSBegin + js.substring(begin31.length, n) + JSEnd;
		} else if (js.endsWith(end31Exports)) {
			n = js.length - end31Exports.length;
			js = JSBegin + ', ' + js.substring(begin31.length, n) + JSEndWithExports;	
		}
		
		return js;
	}
	
	
	static function wrapModule(input:String, hasExports:Bool=false) {
		
		var tpl = new Template(Resource.getString('template'));
		var end = input.lastIndexOf(hasExports ? JSEndWithExports : JSEnd);
		
		return tpl.execute({
			haveExports:hasExports,
			factoryCode:input.substr(1, end),
		});
	}
	
	
	/**
	 * Show instructions and exit.
	 */
	static function instructions() {
		Sys.println('neko UMDWrap.n -in inFile -out outFile');
		Sys.println('');
		Sys.exit(1);
	}
}

class VarNameCheck {
	static function containsIllegals(test:String):Bool {
		return !(~/^[a-zA-Z_][a-zA-Z0-9_]*$/g.match(test)); // only allow a-Z 0-9 and underscore for var names
	}
}