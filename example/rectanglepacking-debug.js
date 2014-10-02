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
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var Main = function() { };
Main.main = function() {
	new js.JQuery(window.document).ready(function(_) {
		var parameters = Main.getScriptSrcParameters("mbp_rectanglePacker");
		if(parameters != null) {
			var container;
			if(parameters.exists("container")) container = parameters.get("container"); else container = "#rectContainer";
			var xCellSize = Std.parseInt(parameters.get("xCellSize"));
			var yCellSize = Std.parseInt(parameters.get("yCellSize"));
			var padX = Std.parseInt(parameters.get("padX"));
			var padY = Std.parseInt(parameters.get("padY"));
			var jContainer = new js.JQuery(container);
			var _g = 0;
			while(_g < 32) {
				var i = _g++;
				new js.JQuery(container).append(new js.JQuery("<div class=\"packableElement\" style=\"width:" + (32 + Std.random(96)) + "px;height:" + (32 + Std.random(96)) + "px;\"></div>"));
			}
			madebypi.util.rectanglepacking.Packer.create(container,xCellSize,yCellSize,padX,padY);
		}
	});
};
Main.getScriptSrcParameters = function(scriptDataSelector) {
	var embed = new js.JQuery("script[data*=" + scriptDataSelector + "]");
	if(embed.length == 0) return null;
	var scriptSrc = embed.attr("src");
	var params = ((function($this) {
		var $r;
		var pos = scriptSrc.indexOf("?") + 1;
		$r = HxOverrides.substr(scriptSrc,pos,null);
		return $r;
	}(this))).split("&");
	var queryParameters = new haxe.ds.StringMap();
	if(params.length < 2) return null;
	var _g1 = 0;
	var _g = params.length;
	while(_g1 < _g) {
		var i = _g1++;
		var param = params[i].split("=");
		queryParameters.set(param[0],param[1]);
	}
	return queryParameters;
};
var NameValuePair = function(name,value) {
	this.name = name;
	this.value = value;
};
var IMap = function() { };
var Std = function() { };
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var haxe = {};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
};
var js = {};
var madebypi = {};
madebypi.util = {};
madebypi.util.rectanglepacking = {};
madebypi.util.rectanglepacking.Packer = $hx_exports.RectanglePacker = function(containerSelector,xCellSize,yCellSize,padX,padY) {
	if(padY == null) padY = 8;
	if(padX == null) padX = 8;
	if(yCellSize == null) yCellSize = 8;
	if(xCellSize == null) xCellSize = 8;
	var _g = this;
	this.container = new js.JQuery(containerSelector);
	if(this.container.length == 0) {
		throw "Container element \"" + containerSelector + "\" does not exist.";
		return;
	}
	this.xCellSize = xCellSize;
	this.yCellSize = yCellSize;
	this.padX = padX;
	this.padY = padY;
	if(xCellSize < 1) xCellSize = 1;
	if(yCellSize < 1) yCellSize = 1;
	this.tempPt = new madebypi.util.rectanglepacking.geom.Point();
	this.outerBounds = madebypi.util.rectanglepacking.Packer.getDomElementBounds(this.container[0]);
	this.fixedElements = new js.JQuery(containerSelector + " div.fixedElement");
	this.packableElements = new js.JQuery(containerSelector + " div.packableElement");
	this.packables = new Array();
	this.packableElements.each(function(index,value) {
		_g.packables.push(new madebypi.util.rectanglepacking.Packable(index,value));
	});
	this.fixedPositions = [];
	this.fixedElements.each(function(index1,element) {
		_g.fixedPositions[index1] = madebypi.util.rectanglepacking.Packer.getDomElementBounds(element);
	});
	this.packableElements.css("display","block").css("background-color","#aaa");
	this.prepare();
	this.fixedElements.css("display","block").css("background-color","#666");
	if(this.packables.length > 0) this.packItem(0); else console.log("Nothing to pack...?");
};
madebypi.util.rectanglepacking.Packer.create = function(containerSelector,xCellSize,yCellSize,padX,padY) {
	if(padY == null) padY = 8;
	if(padX == null) padX = 8;
	if(yCellSize == null) yCellSize = 8;
	if(xCellSize == null) xCellSize = 8;
	return new madebypi.util.rectanglepacking.Packer(containerSelector,xCellSize,yCellSize,padX,padY);
};
madebypi.util.rectanglepacking.Packer.getDomElementBounds = function(dom) {
	var s = dom.style;
	var width = Std.parseInt(HxOverrides.substr(s.width,0,s.width.length - 2));
	var height = Std.parseInt(HxOverrides.substr(s.height,0,s.height.length - 2));
	if(width == null) width = dom.clientWidth;
	if(height == null) height = dom.clientHeight;
	var top = Std.parseInt(s.top);
	var left = Std.parseInt(s.left);
	if(Math.isNaN(top)) top = 0;
	if(Math.isNaN(left)) left = 0;
	return new madebypi.util.rectanglepacking.geom.Rectangle(left,top,width,height);
};
madebypi.util.rectanglepacking.Packer.prototype = {
	prepare: function() {
		var masterFixedNode = new js.JQuery("div#fixed-master.fixedElement");
		var targetRect;
		if(masterFixedNode.length == 0) {
			console.log("#fixed-master not found in .fixedElement items. Using the container instead...");
			targetRect = this.outerBounds.clone();
		} else {
			targetRect = madebypi.util.rectanglepacking.Packer.getDomElementBounds(masterFixedNode[0]);
			masterFixedNode.css("display","block").css("background-color","#666");
		}
		this.sortPackableItemsByArea();
		this.targetPoint = new madebypi.util.rectanglepacking.geom.Point(targetRect.x + Math.round(targetRect.width / 2),targetRect.y + Math.round(targetRect.height / 2));
	}
	,packItem: function(index) {
		var _g = this;
		var r = null;
		var start = new Date().getTime();
		var sortedIndex = this.areaSortedIndices[index];
		var item = this.packables[sortedIndex];
		if(!item.packed && !item.unpackable) {
			r = this.findSpace(this.targetPoint,item.rect.clone());
			if(r == null) {
				console.log("Out of space! Can't place item " + item.index + " " + new js.JQuery(item.element).html());
				item.unpackable = true;
				new js.JQuery(item.element).remove();
			} else {
				console.log("Placing item " + item.index + " at " + r.toString());
				item.packed = true;
				this.fixedPositions.push(r);
				item.jElement.css({ left : r.x}).css({ top : r.y}).css("display","block").removeClass("packableElement").addClass("packedElement");
			}
		}
		var delta = new Date().getTime() - start;
		console.log("Took " + delta + " ms to pack rect");
		index++;
		if(index == this.packables.length) {
			this.packComplete();
			return;
		} else if(delta > 40) haxe.Timer.delay(function() {
			_g.packItem(index);
		},40); else this.packItem(index);
	}
	,packComplete: function() {
		console.log("Packing complete");
		var c = 0;
		var _g1 = 0;
		var _g = this.packables.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.packables[i].packed) c++;
		}
		console.log("Packed " + c + " of a possible " + this.packables.length + " rectangles");
	}
	,findSpace: function(target,rect) {
		rect.inflate(this.padX,this.padY);
		var columns = Math.round(this.outerBounds.width / this.xCellSize);
		var rows = Math.round(this.outerBounds.height / this.yCellSize);
		var dx = 0;
		var dy = 0;
		var px = 0;
		var py = 0;
		var fCount = this.fixedPositions.length;
		var spaceFound = false;
		var distance = this.outerBounds.width * this.outerBounds.height;
		var intersectsFixed = false;
		var nearest = new madebypi.util.rectanglepacking.geom.Rectangle();
		var d;
		var posK;
		distance = distance * distance;
		var _g = 0;
		while(_g < columns) {
			var i = _g++;
			px = i * this.xCellSize;
			rect.x = px;
			var _g1 = 0;
			while(_g1 < rows) {
				var j = _g1++;
				intersectsFixed = false;
				py = j * this.yCellSize;
				rect.y = py;
				if(rect.get_bottom() <= this.outerBounds.get_bottom()) {
					var _g2 = 0;
					while(_g2 < fCount) {
						var k = _g2++;
						posK = this.fixedPositions[k];
						intersectsFixed = intersectsFixed || ((posK.get_right() > rect.get_right()?rect.get_right():posK.get_right()) <= (posK.x < rect.x?rect.x:posK.x)?false:(posK.get_bottom() > rect.get_bottom()?rect.get_bottom():posK.get_bottom()) > (posK.y < rect.y?rect.y:posK.y));
					}
				} else intersectsFixed = true;
				if(!intersectsFixed) {
					spaceFound = true;
					this.tempPt.x = px;
					this.tempPt.y = py;
					dx = target.x - this.tempPt.x;
					dy = target.y - this.tempPt.y;
					d = dx * dx + dy * dy;
					if(d < distance) {
						distance = d;
						nearest.x = rect.x;
						nearest.y = rect.y;
						nearest.width = rect.width;
						nearest.height = rect.height;
					}
				}
			}
		}
		if(!spaceFound) {
			console.log("I'm sorry, I can't place that Dave.");
			return null;
		}
		nearest.inflate(-this.padX,-this.padY);
		return nearest;
	}
	,sortPackableItemsByArea: function() {
		var areas = [];
		var _g1 = 0;
		var _g = this.packables.length;
		while(_g1 < _g) {
			var i = _g1++;
			areas.push({ index : i, area : this.packables[i].rect.get_area()});
		}
		areas.sort(function(a,b) {
			if(a.area > b.area) return -1;
			if(a.area < b.area) return 1;
			return 0;
		});
		this.areaSortedIndices = [];
		var _g11 = 0;
		var _g2 = this.packables.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.areaSortedIndices[i1] = areas[i1].index;
		}
	}
};
madebypi.util.rectanglepacking.Packable = function(index,element) {
	element.id = "packable_" + index;
	this.jElement = new js.JQuery(element);
	this.unpackable = false;
	this.packed = false;
	this.element = element;
	this.index = index;
	this.rect = madebypi.util.rectanglepacking.Packer.getDomElementBounds(element);
};
madebypi.util.rectanglepacking.geom = {};
madebypi.util.rectanglepacking.geom.Point = function(pX,pY) {
	if(pX == null) this.x = 0; else this.x = pX;
	if(pY == null) this.y = 0; else this.y = pY;
};
madebypi.util.rectanglepacking.geom.Point.prototype = {
	clone: function() {
		return new madebypi.util.rectanglepacking.geom.Point(this.x,this.y);
	}
};
madebypi.util.rectanglepacking.geom.Rectangle = function(x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
madebypi.util.rectanglepacking.geom.Rectangle.intersects = function(rectA,rectB) {
	if((rectA.get_right() > rectB.get_right()?rectB.get_right():rectA.get_right()) <= (rectA.x < rectB.x?rectB.x:rectA.x)) return false; else return (rectA.get_bottom() > rectB.get_bottom()?rectB.get_bottom():rectA.get_bottom()) > (rectA.y < rectB.y?rectB.y:rectA.y);
};
madebypi.util.rectanglepacking.geom.Rectangle.prototype = {
	toString: function() {
		return "[Rectangle x:" + this.x + ", y:" + this.y + ", w:" + this.width + ", h:" + this.height + "]";
	}
	,get_area: function() {
		return this.width * this.height;
	}
	,get_left: function() {
		return this.x;
	}
	,get_right: function() {
		return this.x + this.width;
	}
	,get_top: function() {
		return this.y;
	}
	,get_bottom: function() {
		return this.y + this.height;
	}
	,get_topLeft: function() {
		return new madebypi.util.rectanglepacking.geom.Point(this.x,this.y);
	}
	,get_size: function() {
		return new madebypi.util.rectanglepacking.geom.Point(this.width,this.height);
	}
	,get_bottomRight: function() {
		return new madebypi.util.rectanglepacking.geom.Point(this.x + this.width,this.y + this.height);
	}
	,clone: function() {
		return new madebypi.util.rectanglepacking.geom.Rectangle(this.x,this.y,this.width,this.height);
	}
	,inflate: function(dx,dy) {
		this.x -= dx;
		this.width += dx << 1;
		this.y -= dy;
		this.height += dy << 1;
	}
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
var jq;
if(typeof define === 'function' && define.amd) jq = require("jquery"); else jq = window.jQuery;
js.JQuery = jq;
Main.isDebug = true;
madebypi.util.rectanglepacking.Packer.MAX_PACK_TIME = 40;
Main.main();
}));