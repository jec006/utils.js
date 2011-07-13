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
          if(content.indexOf('<') > -1 || content.indexOf('>') > -1 || /&[a-zA-Z]+;/.test(content)){
            el.innerHTML = content;
          } else {
            if(tagName == 'input'){ 
              el.value = content; 
            } else {
              $(el).append(content);
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
      //apply any provided attributes - these attributes should use the js name for this to work properly, for example className instead of class
      for(var a in attr){
        if(a == 'for') { a = 'htmlFor'; attr['htmlFor'] = attr['for']; } //simple fix to allow labels to have 'for' attribute
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
  /**
   *  Creates a list of checkbox options within a holder ul (UnorderedList) and returns it.
   *  
   *  **Parameters**:
   *  <ul>
   *    <li><em>options</em> - an array of options each of which should be in the form 
   *      <code>
   *              {
   *                text: <labeltext>, 
   *                value: <value>, 
   *                checked:<true|false>, 
   *                ch_attrs: {<attrs to be applied to the checkbox>},
   *                label_attrs: {<attrs to be applied to the label>}
   *              }
   *      </code>
   *    </li>
   *    <li><em>name</em> - the name to give the checkboxes input(s), 
   *        if you would like them to each have their own distinct name, set name in each ch_attrs.  <em>If the name parameter is set it will
   *        override the individual names<em>.
   *    </li>
   *  </ul>
   */
  createCheckboxList : function(holder, options, name, radios, nostriping){
    if(!options instanceof Array){
      options = [options];
    }
    
    for(var i=0; i<options.length; i++){
      var option = options[i];
      if(typeof(option.ch_attrs) != 'object'){ option.ch_attrs = {}; };
      option.ch_attrs.type = radios? 'radio' : 'checkbox';
      option.ch_attrs.value = option.value;
      var checked = typeof(option.checked)=='undefined' ? option.ch_attrs.checked||false : option.checked;
      if(name){ option.ch_attrs.name = name; };
      if(nostriping){
        var item = u.appendChild(holder, u.createElement('li', '', {className:'checkbox-row clearfix'}));
      } else {
        var item = u.appendChild(holder, u.createElement('li', '', {className:'checkbox-row clearfix ' + (i%2?'odd':'even')}));
      }
      
      //var str = '<input type="' + option.ch_attrs.type + '" ' + (option.ch_attrs.checked ? 'checked ' : '') + 'cvalue="'+option.value + '"/>';
      //$(item).append(str);
      if(!radios){
        var c = u.appendChild(item, u.createElement('input', '', option.ch_attrs));
        c.cvalue = option.value;
        c.checked = checked;
      } else {
        item.innerHTML = '<input type="radio" value="'+option.value+'" cvalue="'+option.value+'" name="'+name+'" ' + (checked?'checked':'') + '/>';     
      }   
      item.appendChild(u.createElement('label', option.text, option.label_attrs));
    }
    return holder;
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
  bind : function(o, f){
  	return function() { return f.apply(o, arguments); };
  },
  IEsafeDate : function(dateStr) {
  	//reformat the date string so IE doesn't choke
  	//from: 2010-04-30T09:30:00Z
  	//to:   04-03-2010 09:30:00 UTC
  	if (navigator.appName == 'Microsoft Internet Explorer') {
	  	var monthday = dateStr.substring(6, 10);
	  	var year = dateStr.substring(0, 4);
	  	var time = dateStr.substring(11, 19);
	  	var timezone = dateStr.substring(19);
	  	if (timezone == 'Z') {
	  		timezone = 'UTC';
	  	}
	  	return monthday + '-' + year + ' ' + time + ' ' + timezone;
  	} else {
  		return dateStr;
  	}
  },
  formatDate : function(dateStr) {
  	date = new Date(u.IEsafeDate(dateStr));
  	var year = date.getFullYear();
  	var month = date.getMonth() + 1;
  	var day = date.getDate();
  	var hour = date.getHours();
  	if (hour == 12) {
  		var ampm = 'PM';
  	} else if (hour >= 12) {
  		hour = hour - 12;
  		var ampm = 'PM';
  	} else if (hour == 0) {
  		hour = 12;
  		var ampm = 'AM';
  	} else {
  		var ampm = 'AM';
  	}
  	var minute = date.getMinutes();
  	if (minute < 10) {
  		minute = '0' + minute;
  	}
  	
  	return month + '/' + day + '/' + year + ', ' + hour + ':' + minute + ' ' + ampm;
  },
  arrayRemove : function(arr, el){
    for(var i = 0; i < arr.length; i++){
      if(arr[i] == el){
        arr.splice(i, 1);
        break;
      }
    }
    return arr;
  },
  createGoogleMapsLink : function(obj){
    //link beginning
    var base = 'http://maps.google.com/maps?q=';
    //ensure we don't get "undefined's"
    var street = obj.street ? obj.street : '';
    var city = obj.city ? ' ' + obj.city : '';
    var state = obj.state ? ' ' + obj.state : '';
    var postal_code = obj.postal_code ? ' ' + obj.postal_code : '';
    var county = obj.county ? ' ' + obj.county : '';
    
    var loc = street + city + state + postal_code + county;
    var loc = loc.replace(/ /g, '+');
    
    //We can change this text / remove it if needed
    var link = u.createElement('a', 'GoogleMaps', {href:base+loc, className:'google-maps-link location', target:'_BLANK'});
    
    return link;
  },
  /**
   *  Does not modify passed array - creates a copy
   *  
   *  Potential point of slow-down
   *  Returns an array with only the elements that func returned true for
   */
  filter : function(array, func){
    var ret = new Array();
    for(var i = 0; i < array.length; i++){
      if(func(array[i])){
        ret.push(array[i]);
      }
    }
    return ret;
  },
  createParamString : function(obj){
    var string = '';
    for(var i in obj){
      string += (string?'&':'') + encodeURI(i) + '=' + encodeURI(obj[i]);
    }
    return string;
  },
  restripe : function(list){
    var l = list.children.length;
    for(var i = 0; i<l; i++){
      if(i%2){
        $(list.children[i]).addClass('odd').removeClass('even');
      } else {
         $(list.children[i]).addClass('even').removeClass('odd');
      }
    }
  }
};
 //alias window.u and Utils for shortness
window.u = Utils;