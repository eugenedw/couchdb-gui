couchdbgui
.factory('UserService', function($http,$rootScope,$global,DAO) {

	var _list = function(page,size){
		return DAO.list(page,size,DAO.REST.user.list)
	}
	
	var _get = function(id){
		return DAO.get(id,DAO.REST.user.get);
	}
	
	var _save = function(obj){
		return DAO.save(obj,DAO.REST.user.save);
	}
	
	var _addkey = function(obj){
		return DAO.save(id,DAO.REST.user.addkey);
	}
	
	return {
	    list : _list,
	    get : _get,
	    save : _save,
	    addkey : _addkey
    };
    
});
