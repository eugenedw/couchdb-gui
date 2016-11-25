couchdbgui
.factory('ConfigurationService', function($http,$rootScope,$global) {

	  return {
	    listByApplication: _list
    };

    var _list = function(appid){
            			var req = $http({
            				method: "get",
            				url: _baseurl+"/manage/app/" + appid
            			}).then(function(res){
                           var application = res.data;
                           return res.data.flowSet;
            					    },
                					function(res){
                						console.log("No flows were returned...")
                    			});
            			return req;
                }

});
