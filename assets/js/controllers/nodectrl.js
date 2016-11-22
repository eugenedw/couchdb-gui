servicebus.controller('NodeCtrl',
		function($scope,$stateParams,$state,$global,NodeService){

	var breadcrumb = [
		$global.defaults.breadcrumb,
		{ path: "#/monitor/node/list", name: "Nodes" }
	];

	$scope.nodelist = [];
	
	var initbc = function(){
		//finally set the breadcrumb
		$global.setbreadcrumb(breadcrumb);
	}
	
	var initnodes = function(){
		NodeService.list().then(function(res){
			$scope.nodelist = res;
		});
	}
	
	$global.initview([initnodes,initbc]);
	
});