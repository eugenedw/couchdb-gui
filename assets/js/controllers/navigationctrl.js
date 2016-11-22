servicebus.controller('NavigationCtrl',function($scope,$stateParams,$http,$state,$global,$q,ApplicationService,ModuleService){

  $scope.navigation = [];
  var modulelist = [];
  var applist = [];

  var loadnavigation = function(){

		var req = $http({
			method: "get",
			url: "assets/js/navigation.json"
		})
        .then(
        	function(res){
				 $scope.navigation = res.data;
                 setupapps().then(function(d){
                   applist = d;
                   setupmodules().then(function(r){
                     modulelist = r;
                     traverse($scope.navigation);
                     $('.tree-toggle').click(
			                    		 function () {	
			                    			 $(this).parent().children('ul.tree').toggle(200);
			                    		 }
			                    	   );
                   });
                 });
			},
			function(res){
				console.log("No applications returned...");
			});
			return req;

  };

  loadnavigation();

  var traverse = function(o,func) {
      for (var i in o) {
          if( o[i] == "applicationList" ){
            o[i] = applist;
          }
          else if( o[i] == "moduleList" ){
            o[i] = modulelist;
          }
          if (o[i] !== null && typeof(o[i])=="object") {
            traverse(o[i],func);
          }
      }
  }
 
  var setupapps = function(){
    var deferred = $q.defer();
    ApplicationService.list().then(function(d){
      var retarr = [];
      angular.forEach(d,function(o,k){
    	var arro = {
    		"title" : o.name,
    		"link" : "#/application/view/" + o.id
    	};
    	retarr.push(arro);
      });
      deferred.resolve(retarr);
    });
    return deferred.promise;
  }

  var setupmodules = function(){
    var deferred = $q.defer();
    ModuleService.list().then(function(d){
	    var retarr = [];
	    angular.forEach(d,function(o,k){
	      	var arro = {
	      		"title" : o.name,
	      		"link" : "#/module/view/" + o.id
	      	};
	      	retarr.push(arro);
	    });
	    deferred.resolve(retarr);
    });
    return deferred.promise;
  }


});
