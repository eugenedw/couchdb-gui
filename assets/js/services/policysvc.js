servicebus
.factory('PolicyService', function($http,$rootScope,$global,DAO) {

	var _list = function(page,size){
		return DAO.list(page,size,DAO.REST.policy.list)
	}
	
	var _get = function(id){
		return DAO.get(id,DAO.REST.policy.get);
	}
	
	var _save = function(obj){
		return DAO.save(obj,DAO.REST.policy.save);
	}
	
	return {
	    list : _list,
	    get : _get,
	    save : _save
    };
    

});
