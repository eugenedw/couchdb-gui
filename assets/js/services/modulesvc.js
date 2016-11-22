servicebus
.factory('ModuleService', function($http,$rootScope,$global,DAO) {

	var _list = function(page,size){
		return DAO.list(page,size,DAO.REST.module.list);
	};		
	
	var _getConfiguration = function(id){
		return DAO.get(id,DAO.REST.moduleconfiguration.get);
	}							
	
	var _get = function(id){
		return DAO.get(id,DAO.REST.module.get);
	}

	return {
		list: _list,
		get: _get,
		getConfig : _getConfiguration
	};

});
