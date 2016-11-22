servicebus.controller('RoleCtrl',
		function($scope,$stateParams,$state,$q,$global,$location,RoleService,PolicyService){
	
	var breadcrumb = [
		$global.defaults.breadcrumb,
		{ path: "#/access/role/list", name: "Roles" }
	];
	
	$scope.currentrole = {};
	$scope.rolelist = [];
	$scope.allpolicies = [];
	$scope.currentpolicies = [];

	if( $state.current.name == 'roleview'
		 || $state.current.name == 'roleedit' ){
		
		if( $stateParams.id != "new"){
			RoleService.get($stateParams.id).then(function(role){
				$scope.currentrole = role;
				$scope.currentrole.policySet.sort(function(p1,p2){
					return p1.name > p2.name;
				});
				angular.forEach($scope.currentrole.policySet,function(pol,k){
					$scope.currentpolicies[pol.id] = true;
				});
				breadcrumb.push({ path: "#/access/role/view/" + $stateParams.id, name: role.name });
			});
		}
		else{
			$scope.currentrole = {};
		}
		
	}
	
	$scope.saveRole = function(){
		
		if( $scope.currentrole.name === undefined 
				|| $scope.currentrole.name == "" ){
			alert("The role name is required");
			return false;
		}
		else if( $scope.currentrole.description === undefined 
					|| $scope.currentrole.description == "" ){
			alert("A description for this role is required");
			return false;
		}
		
		RoleService.save($scope.currentrole)
			.then(function(role){
			$location.path("/access/role/view/" + role.id);
		});
		
	}
	
	$scope.updatepolicies = function(){
		var addedpolicies = [];
		for( var permid in $scope.currentpolicies){
			if( $scope.currentpolicies[permid] ){
				addedpolicies.push($global.findById($scope.allpolicies,permid));
			}
		};
		$scope.currentrole.policySet = addedpolicies;
	}
	
	var initpolicies = function(){
		var deferred = $q.defer();
		PolicyService.list().then(function(res){
			$scope.allpolicies = res;
			deferred.resolve(res);
		});
		return deferred.promise;
	}
	
	var initroles = function(){
		var deferred = $q.defer();
		RoleService.list().then(function(res){
			$scope.rolelist = res;
			deferred.resolve("done");
		});
		return deferred.promise;
	}

	var initbc = function(){
		//finally set the breadcrumb
		$global.setbreadcrumb(breadcrumb);
	}
		
	$global.initview([initroles,initpolicies,initbc]);
	
	
});