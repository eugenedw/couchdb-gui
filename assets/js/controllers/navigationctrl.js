couchdbgui.controller('NavigationCtrl',function($scope,$stateParams,$http,$timeout,$state,$global,$q,DatabaseService){

  $scope.navigation = [];
  var modulelist = [];
  var applist = [];

  var loadnavigation = function(){

		var req = $http({
			method: "get",
			url: "assets/js/navigation.json"
		})
    .then(function(res){
				 $scope.navigation = res.data;
         traverse($scope.navigation);
         $timeout(function(){
           $('.tree-toggle').click(
               function () {
                 $(this).parent().children('ul.tree').toggle(200);
               }
            );
         },2000);
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


});
