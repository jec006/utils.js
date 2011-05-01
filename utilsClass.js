/**
 *  Group of utility functions for javascript
 *
 *  @author jcaldwell
 *  @file utils.js
 **/
 
 var Utils = {
  //add a class to an element
  addClass : function(e, c){
    if(!e.className.match(new RegExp("(\s*|^)"+c+"(\s*|$)"))){
      e.className += e.className == '' ? c : ' '+c;
    }
  },
  //remove a class from an element
  rmClass : function(e, c){
    e.className = e.className.replace(new RegExp("(\s*|^)"+c+"(\s*|$)", 'g'), '');
  },
 	//A function for creating a DOM element and assigning attributes and content
  createElement : function(tagName, content, attr){
    var el = document.createElement(tagName);
    if(el){
      switch (typeof(content)) 
      {
        case 'object' : 
          if(content && content != null)
            el.appendChild(content);
          break;
        case 'string' :
          if(content.indexOf('<') > -1 && content.indexOf('>') > -1){
            content.innerHTML = content;
          } else {
            if(tagName == 'input'){ 
              el.value = content; 
            } else {
              el.appendChild(document.createTextNode(content));
            } 
          }
          break;
        case 'undefined':
          //do nothing
          break
        default :
          //We aren't sure what this is but we'll just set the innerHTML element and call it a day
          typeof(el.innerHTML) != 'undefined' ? el.innerHTML = content : content;
      }  
      //apply any provided attributes
      for(var a in attr){
        el[a] = attr[a];
      }
    }      
    return el;
      
  },
  //convience function for appending and storing
  appendChild : function(parent, el){
    parent.appendChild(el);
    return el;
  },
  createTable : function(data, headers){
    var table = u.createElement('table');
    var rowWidth = 2;
    if(typeof(headers) != 'object'){
      //assume its just a number of cells per row
      var temp = parseInt(headers);
      rowWidth = isNaN(temp) ? rowWidth : temp;
    } else {
      //create the headers
      rowWidth = headers.length
      var thead = u.appendChild(table, u.createElement('thead'));
      for(var i=0; i<rowWidth; i++){
        thead.appendChild(u.createElement('th', headers[i], {className: 'table-header col-'+(i%2?'odd':'even')}));
      }
    }
    var tbody = u.appendChild(table, u.createElement('tbody'));
    for(var i=0; i<data.length; i+=rowWidth){
      var tr = u.appendChild(tbody, u.createElement('tr', '', {className: 'table-row row-'+(i%(2*rowWidth)?'odd':'even')}));
      for(var c=0; c<rowWidth && i+c < data.length; c++){
        tr.appendChild(u.createElement('td', data[i+c], {className: 'table-cell cell-'+(c%2?'odd':'even')}));
      }
    }
    return table;
  },
  //returns the 'real type' of an object instead of just 'Object'
  realType : function(obj){
    if(obj && obj.constructor){
      return obj.constructor.name;
    } else {
      return typeof(obj);
    }
  },
  //Inspect an object - returns a string
  inspect : function(obj, index, tabs){
    if(!index){
      var index = ''; 
    }else{
      index += ' : ';
    }
    if(!tabs) var tabs = 0;
    
    var rtype = u.realType(obj);
    
    var mTabs = function(){ 
      var str = '';
      for(var i = 0; i < tabs; i++){
        str += "\t";
      }
      return str;
    };

    if(typeof(obj) != 'object'){
      return index + obj + ' <'+typeof(obj)+'>';
    }  
    var ss = ' {', se = '}';
    if (rtype == 'Array'){
      ss = ' ['; se = ']';
    }
      
    var str = index + rtype + ss;
    for(var sub in obj){
      var ind = rtype =='Array' ? '' : sub;
      str += "\n\t"+mTabs()+ u.inspect(obj[sub], ind, tabs+1)+',';
    }
    if(str.indexOf(',') > -1) str = str.substr(0, str.length-1);
    str+= "\n"+mTabs()+se;
    return str;

  },
  //inspect an object - returns an HTMLDivElement
  inspectToElement : function(obj, index){
    if(!index){
      var index = ''; 
    }else{
      index += ' : ';
    }
    var rtype = u.realType(obj);
    
    if(typeof(obj) != 'object'){
      return u.createElement('div', index + obj + ' ('+typeof(obj)+')', {className : 'value'});
    }  
    else if (rtype == 'Array'){
      var el = u.createElement('div', index + rtype + ' [', {className : 'object-inspector'});
      var children = u.createElement('ul', null, {className : 'child-list'});
      el.appendChild(children);
      for(var i in obj){
        children.appendChild(u.createElement('li', u.inspectToElement(obj[i]), {className : 'child'}));
      }
      el.appendChild(document.createTextNode(']'));
      return el;
    }
    else {
      var el = u.createElement('div', index + rtype, {className : 'object-inspector'});
      var children = u.createElement('ul', null, {className : 'child-list'});
      el.appendChild(children);
 
      for(var sub in obj){
        children.appendChild(u.createElement('li', u.inspectToElement(obj[sub], sub), {className : 'child'}));
      }
 
      return el;
    }
  },
  bind : function(obj, func){
  	return function() { return func.apply(obj, arguments); };
  }
};
 //alias window.u and Utils for shortness
 window.u = Utils;