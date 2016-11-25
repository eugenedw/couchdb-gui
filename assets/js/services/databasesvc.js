couchdbgui
.factory('DatabaseService', function($http,$rootScope,$global,DAO) {

	var _list = function(page,size){
		return DAO.list(page,size,DAO.REST.application.list)
	}

	var _get = function(id){
		return DAO.get(id,DAO.REST.application.get);
	}

	var _save = function(app){
		return DAO.save(app,DAO.REST.application.save);
	}

	var _remove = function(id){
		return DAO.remove(id,DAO.REST.application.remove);
	}

	return {
		list : _list,
		get : _get,
		save : _save,
		remove : _remove
	}

});
