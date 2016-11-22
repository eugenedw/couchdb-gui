servicebus
.factory('$global',function($http,$q,$rootScope,$timeout,$location,$anchorScroll){

	var _self = this;

	_self.breadcrumb = undefined;
	_self.toggledef = {};
	_self.activetabs = {};
	_self.modal = {};
	_self.alertbanner = {message: "not set", showing: false };

	var _setbreadcrumb = function(patharr){
		_self.breadcrumb = patharr;
	}

	var _getbreadcrumb = function(){
		return _self.breadcrumb;
	}

	var getSystemSettings = function getSystemSettings(){
		return {"setting":"a setting"};
	}
	
	var initializeView = function(methods){
		for(v in methods){
			methods[v].call();
		}
	}
	
	var scrollto = function(divname){
		$location.hash(divname);
		$anchorScroll();
	}
	
	var triggerConfirmationModal = function(title,body,buttontext,confirmmethod,btnstyle){
		_self.modal["modalTitle"] = title;
		_self.modal["modalBody"] = body;
		_self.modal["proceedButton"] = {};
		_self.modal["proceedButton"].text = buttontext;
		_self.modal["proceedButton"].method = confirmmethod;
		_self.modal["proceedButton"].btnstyle = btnstyle;
		$("#globalModal").modal("show");
	}

	var confirmModal = function(){
		_self.modal["proceedButton"].method();
		$("#globalModal").modal("hide");
	}
	
	var toggle = function(type,force){
		if( force ){
			if( force == 'hide' ){
				_self.toggledef[type] = false;
			}
			else if( force == 'show' ){
				_self.toggledef[type] = true;
			}
		}
		else if( _self.toggledef[type] ){
			_self.toggledef[type] = false;
		}
		else{
			_self.toggledef[type] = true;
		}
	}
	
	var toggledef = function(def){
		if( def instanceof Array ){
			var ret = false;
			angular.forEach(def,function(te,k){
				if( _self.toggledef[te] === undefined ){
					_self.toggledef[te] = false; 
				}
				if( _self.toggledef[te] ){
					ret = true;
				}
			});
			return ret;
		}
		else{
			if( _self.toggledef[def] === undefined ){
				_self.toggledef[def] = false; 
			}
			return _self.toggledef[def];
		}
	}
	
	var activeTab = function(page,tabname){
		if( _self.activetabs[page] === undefined ){
			_self.activetabs[page] = {};
		}
		
		if( !tabname ){
			var tabactive = false;
			for( var tab in _self.activetabs[page] ){
				if( _self.activetabs[page][tab] ){
					tabactive = true;
				}
			}
			return tabactive;
		}
		else{
			if( _self.activetabs[page][tabname] === undefined ){
				_self.activetabs[page][tabname] = false;
			}
			return _self.activetabs[page][tabname];
		}
	}
	
	var setActiveTab = function(page,tabname){
		if( _self.activetabs[page] === undefined ){
			_self.activetabs[page] = {};
		}
		if( _self.activetabs[page][tabname] === undefined
				|| !_self.activetabs[page][tabname] ){
			_self.activetabs[page][tabname] = true;
		}
		for( var tab in _self.activetabs[page] ){
			if( tab != tabname ){
				_self.activetabs[page][tab] = false;
			}
		}
	}
	
	var findById = function(set,id){
		var obj = {};
		angular.forEach(set,function(rol,k){
			if( rol.id == id ){
				obj = rol;
			}
		});
		return obj;
	}
	
	var scrollto = function(el){
		$timeout(function(){
			$('html, body').animate({
		        scrollTop: $("#"+el).offset().top
		    }, 2000);
		},1000);
	}
	
	var guid = function(){
		function s4(){
			return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
		}
		return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
	}
	
	var showbanner = function(msg){
		_self.alertbanner.message = msg;
		_self.alertbanner.showing = true;
		$timeout(function(){
			_self.alertbanner.showing = false;
		},5000);
	}
	
	var order = function(collection,orderby){
		collection.sort(function(a1,a2){
			var field1 = a1[orderby]||"";
			var field2 = a2[orderby]||"";
			//using natural alphanumeric order
			if( isNaN(field1) ){
				field1 = field1.toLowerCase();
			}
			if( isNaN(field2) ){
				field2 = field2.toLowerCase();
			}
			var ret = field1 > field2;
			return ret;
		});
		return collection;
	}

	return {
	    defaults : {
		  breadcrumb : { path: "#/home", name: "Home" }
	    },
		setbreadcrumb : _setbreadcrumb,
		getbreadcrumb : _getbreadcrumb,
		settings : getSystemSettings,
		initview : initializeView,
		toggle : toggle,
		toggledef : toggledef,
		findById : findById,
		scrollto : scrollto,
		activeTab : activeTab,
		setActiveTab : setActiveTab,
		confirm : triggerConfirmationModal,
		alert : triggerConfirmationModal,
		guid : guid,
		modal : _self.modal,
		modalconfirm : confirmModal,
		showbanner : showbanner,
		alertbanner : _self.alertbanner,
		order : order
	};

});
