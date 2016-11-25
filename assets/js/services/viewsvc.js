couchdbgui
.factory('ViewService', function($http,$rootScope,$q,$global) {

    var _list = function(){
									var deferred = $q.defer();
									$global.database.allDocs({
										"include_docs" : true,
										"startkey" : "_design/",
										"endkey" : "_design0"
									},function(err,res){
										deferred.resolve(res.rows);
									});
            			return deferred.promise;
                }


    function _getByView( viewname, opts ){

        var _startkey = undefined;
        var _endkey = undefined;
        var _keys = undefined;
        var ascending = undefined;
        var limit = undefined;
        var skip = undefined;

        for( k in opts ){
          if( k == "startkey" ){
            _startkey = opts[k];
          }
          else if( k == "endkey" ){
            _endkey = opts[k];
          }
          else if( k == "page" ){
            skip = opts[k];
          }
          else if( k == "size" ){
            limit = opts[k];
          }
        }

        var params = {
          "include_docs" : true
        };

        if( skip !== undefined
            && limit !== undefined ){
            skip = limit*skip;
            params["skip"] = skip;
            params["limit"] = limit;
        }

        var deferred = $q.defer();
        if( typeof _startkey == 'string' ){
          _startkey = [_startkey];
        }
        if( _endkey && typeof _endkey == 'string' ){
          _endkey = [_endkey];
        }
        if( _endkey ){

          params["startkey"] = _startkey;
          params["endkey"] = _endkey;
          params["descending"] = ascending?false:true;

          $global.database.query(viewname,params,function(err,res){
            if(err){
              console.log(JSON.stringify(err));
              deferred.resolve(results);
            }
            else{
              deferred.resolve(res.rows);
            }
          });
        }
        else if( _startkey ){

          params["keys"] = _startkey;

          $global.database.query(viewname,params,function(err, res){
            if( err ){
              console.log(JSON.stringify(err));
              deferred.resolve(results);
            }
            else{
              deferred.resolve(res.rows);
            }
          });
        }
        else{
          $global.database.query(viewname,params,function(err,res){
            if( err ){
              console.log(JSON.stringify(err));
              deferred.resolve([]);
            }
            else{
              deferred.resolve(res.rows);
            }
          });
        }
        return deferred.promise;

    }

	  return {
	    list : _list,
		  view : _getByView
    };

});
