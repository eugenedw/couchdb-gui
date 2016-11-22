servicebus.controller('ModuleCtrl',
    function($scope,$stateParams,$state,$global,$timeout,$q,$location,ModuleService,ModuleConfigurationService){

		var breadcrumb = [
			$global.defaults.breadcrumb,
			{ path: "#/module/list", name: "Modules" }
		];

		$scope.modulelist;
		$scope.currentmodule;
			
		var initmodules = function(){
			var deferred = $q.defer();
			ModuleService.list().then(function(res){
				$scope.modulelist = res;
				deferred.resolve("done");
			});
			return deferred.promise;
		}

		var initbc = function(){
			//finally set the breadcrumb
			$global.setbreadcrumb(breadcrumb);
		}
		
		if( $state.current.name == 'moduleview' ){
			ModuleService.get($stateParams.id).then(function(module){
				$scope.currentmodule = module;
				$scope.currentmodule["configurationSchema"] = $scope.getConfigurationForModule(module);
				$scope.currentmodule["configurationFields"] = $scope.getFields($scope.currentmodule["configurationSchema"]);
				ModuleService.getConfig().then(function(data){
					$scope.currentmodule["configurationData"] = data.configuration;
				});
				breadcrumb.push({ path: "#/module/view/" + $stateParams.id, name: module.name });
			});
		}

		$scope.getmodule = function(modid){
			var retmod = {};
			angular.forEach($scope.modulelist,function(mod,k){
				if( mod.id == modid ){
					retmod = mod;
				}
			});
			return retmod;
		}	
		
		$scope.getConfigurationForModule = function(module){
			//create the configuration object based on the schema
			var config = ModuleConfigurationService.buildObject(module.schema);
			//populate the values for the configuration object using the module configuration
			return config;
		}
		
		$scope.fieldType = function(fld){
			if( Array.isArray(fld) ){
				return "array";
			}
			if( fld == null ){
				return "string";
			}
			return typeof fld;
		}
		
		$scope.normalizeFieldName = function(fld){
			var nm = fld.toUpperCase();
			if( nm.endsWith("SET") ){
				nm = nm.substring(-3,nm.length-3);
				nm += " (SET)";
			}
			return nm;	
		}
		
		$scope.getFields = function(obj,lev){
			if( !lev ){
				lev = 0;
			}
			var flds = [];
			for( v in obj ){
				if( $scope.fieldType(obj[v]).toLowerCase() == "object" ){
					flds.push({"name":v,"type":"parent","level":lev,"FIELD_TYPE":obj[v].FIELD_TYPE});
					angular.forEach($scope.getFields(obj[v],lev+1),function(_fld,k){
						flds.push(_fld);
					});
				}
				else{
					flds.push({"name":v,"type":obj[v],"level":lev,"FIELD_TYPE":obj[v].FIELD_TYPE});
				}
			}
			return flds;
		}
		
		$scope.blockvisible = [];
		$scope.blockToggle = function(blockId){
			if( !$scope.blockvisible[blockId] ){
				$scope.blockvisible[blockId] = true;
			}
			else{
				$scope.blockvisible[blockId] = false;
			}
		}
		
		$scope.collapseall = function(){
			for( v in $scope.blockvisible ){
				if( $scope.blockvisible[v] ){
					$scope.blockvisible[v] = false;
				}
			}
		}
		
		$scope.toggled = function(){
			var isopen = false;
			for( v in $scope.blockvisible ){
				if( $scope.blockvisible[v] ){
					isopen = true;
				}
			}
			return isopen;
		}

		$global.initview([initmodules,initbc]);

});
