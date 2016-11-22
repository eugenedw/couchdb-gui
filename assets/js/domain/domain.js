function FlowExecution(){
		
	var _this = this;
	
	this.argumentMap = {
		//arguments are populated by the module instantiating this object
	};
	
	this.moduleReference = {
		description : "",
		id : "",
		name : "",
		reference : "",
		requiredArgumentSet : [],
		version : ""
	};
	
	this.setArguments = function(args){
		for( k in args ){
			_this.moduleReference.requiredArgumentSet.push(k);
			_this.argumentMap[k] = args[k];
		}
	};
	
	this.setModuleReference = function(mr){
		_this.moduleReference = mr;
		if( mr.requiredArgumentSet !== undefined ){
			for( a in mr.requiredArgumentSet ){
				_this.argumentMap[mr.requiredArgumentSet[a]] = "";
			}
		}
	}
	
};

function ApplicationFlow(){
	
	var _this = this;
	
	this.description = "";
	this.enabled = false;
	this.executionList = [];
	this.executionMap = {};
	this.id = "";
	this.name = "";
	this.version = "";
	
	this.buildApplicationFlow = function(flow){
		_this.description = flow.description;
		_this.enabled = flow.enabled;
		_this.executionList = flow.executionList;
		_this.id = flow.id;
		_this.name = flow.name;
		_this.version = flow.version;
	}
	
}