servicebus.controller('MainCtrl',function($scope,$global,ApplicationService,ModuleService){

    $global.setbreadcrumb([
  		{ path: "#/home", name: "Home" }
  	]);

    $scope.breadcrumb = function(){
      return $global.getbreadcrumb();
    }

    ApplicationService.list().then(function(res){
      $scope.applicationlist = res;
    });

    ModuleService.list().then(function(res){
      $scope.modulelist = res;
    })


});
