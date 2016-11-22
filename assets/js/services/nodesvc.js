servicebus
.factory('NodeService', function($http,$rootScope,$global,DAO) {

	var _list = function(page,size){
		return DAO.list(page,size,DAO.REST.node.list);
	};

	return {
		list: _list
	};

});
