//Bind a function to an object
function bind(obj, func){
	return function() { return func.apply(obj, arguments); };
}
/** 
 *  Get an array of elements with the given className - using the given object as a context
 *  if no object is given document.body is used.
 */
function getElementsByClassName(className, obj){
	var objs = new Array();
	if(!obj) var obj = document.body;
	
	if(obj.className.indexOf(className) > -1){
		objs.push(obj);
	}
	if(obj.childNodes.length){
		var children = obj.childNodes;
		for(var i = 0; i < children.length; i++){
			objs = objs.concat(getElementsByClassName(className, children[i]));
		}
	} 
	return objs;
}

/**
 *  Get the absolute top of an element
 */
function getTop(obj){
	var top = 0;
	while(obj){
		top += parseInt(obj.offsetTop);
		obj = obj.offsetParent;
	}
	
	return top;
}

/**
 *  Get the absolute top and left of an object
 *  if you only need the top it is more efficient to use the getTop function
 */
function getTopAndLeft(obj){
  var top = 0;
  var left = 0;
	while(obj){
		top += parseInt(obj.offsetTop);
    left += parseInt(obj.offsetLeft);
		obj = obj.offsetParent;
	}
	
	return { 'top' : top, 'left' : left };
}

/**
 *  Get the current css property for the given obj
 *
 */
function getCSS(obj, prop){
	var properties;
	if(window.getComputedStyle){
		properties = window.getComputedStyle(obj, null);		
		
	}	
	else if(obj.currentStyle){
		properties = obj.currentStyle
	}
	
	if(prop == 'background'){
		var color = properties['backgroundColor']?properties['backgroundColor']:"";
		var img = properties['backgroundImage']?properties['backgroundImage']:"";
		var repeat = properties['backgroundRepeat']?properties['backgroundRepeat']:"";
		var attach = properties['backgroundAttachment']?properties['backgroundAttachment']:"";
		var position = properties['backgroundPosition']?properties['backgroundPosition']:"";
		
		return color + ' ' + img + ' ' + repeat + ' ' + attach + ' ' + position;
	}
	else {
		return properties[prop]; 
	}
}

/**
 *  Fade in after the timeout period.  
 *  When the fade function is completed the callback function will be called  
 */
function fadeInWait(obj, timeout, cb){
	obj.style.opacity = '0';
	obj.style.filter = 'alpha(opacity=0)';
	
	var animate = new Animate(obj);
	setTimeout(function(){
		animate.fadeSlow(cb);
	}, timeout);
}

/**
 *  Javascript class to register functions to run when the document is 'Ready'
 *
 *  To register a function to run on DOM Ready simply call 'dR.add(<your function>;'
 */

function DocReady(func){
	this.init();
	if(func) this.add(func);
}

DocReady.prototype.readyFunctions = function() { };

DocReady.prototype.init = function(){
	//flag
	this.ran = false;

	this.addListeners();	
}

DocReady.prototype.addListeners = function()
{
	var runFunc = bind(this, this.readyFunctions);
	//register event Readyrs
	if(document.addEventListener){ //Moz or Opera
		document.addEventListener('DOMContentLoaded', runFunc, false);
		window.addEventListener('load', runFunc, false); //just in case
	} else if(document.all && !window.opera && document.readyState) { //IE
		var src = (window.location.protocol == 'https:') ? '://0' : 'javascript:void(0)';
		document.write("<script id='DOMReady' defer=true src='" + src + "'><\/script>");  
		document.getElementById("DOMReady").onreadystatechange=function(){
		    if (this.readyState=="complete"){ runFunc(); }
		}
	} else if(document.readyState && (navigator.userAgent.indexOf('AppleWebKit/') > -1)){ //safari
		this.timer = setInterval(function() {
			if (document.readyState == 'loaded' || document.readyState == 'complete') { runFunc(); }
		}, 50);
	} else { //older browsers
		var fn = window.onload;
		window.onload = function() {
			runFunc();
			if (fn) fn();
		}
	}
}

DocReady.prototype.add = function(func){
	if(typeof(func) != 'function'){ return false; }
	if(this.ran){ return func(); }
	var fn;
	if(typeof(this.readyFunctions) == 'function'){
		fn = bind(this, this.readyFunctions);
	}else{
		fn = function(){};
	}
	
	this.readyFunctions = function () {
		if(!this.ran){
			if(this.timer){ clearInterval(this.timer); }
			fn();
			func();
		}
		this.ran = true;
	}
	
	this.addListeners();
}
//Create a DocReady object to register functions with
var dR = new DocReady();