couchdbgui
.factory('DocumentService', function($http,$rootScope,$q,$global) {

    var _list = function(page,size){
										var deferred = $q.defer();
										$global.database.allDocs({
											"limit" : size,
											"skip" : page*size,
											"include_docs" : true,
											"descending" : true
										},function(err,res){
											deferred.resolve(res.rows);
										});
										return deferred.promise;
                }


    var _getById = function(did){
    	var deferred = $q.defer();
    	$global.database.get(did).then(function(doc) {
    		  return deferred.resolve(doc);
		}).then(function(doc) {
			  return deferred.resolve(doc);
		}).catch(function (err) {
			console.log(err);
			return deferred.resolve(err);
		});
    	return deferred.promise;
    }

	  return {
	    list: _list,
      get: _getById
    };



});
