servicebus.controller('PolicyCtrl',
		function($scope,$stateParams,$state,$q,$global,$location,PolicyService){

	var breadcrumb = [
		$global.defaults.breadcrumb,
		{ path: "#/access/policy/list", name: "Policies" }
	];
	
	$scope.currentpolicy = {};
	$scope.policylist = [];
	$scope.newpermission = {};

	if( $state.current.name == 'policyview'
		 || $state.current.name == 'policyedit' ){
		
		if( $stateParams.id != "new"){
			PolicyService.get($stateParams.id).then(function(policy){
				$scope.currentpolicy = policy;
				breadcrumb.push({ path: "#/access/policy/view/" + $stateParams.id, name: policy.name });
			});
		}
		else{
			$scope.currentpolicy = {};
		}
	}
	
	$scope.policycheck = function(_policy){
		return !(_policy.resourceMap === undefined 
					|| _policy.resourceMap == null 
					|| _policy.resourceMap.length == 0
					|| (
						(_policy.resourceMap['ALLOW'] === undefined || _policy.resourceMap['ALLOW'].length == 0)
						&&
						(_policy.resourceMap['DENY'] === undefined || _policy.resourceMap['DENY'].length == 0)
						));
	}
	
	$scope.savePolicy = function(){
		
		if( $scope.currentpolicy.name === undefined 
				|| $scope.currentpolicy.name == "" ){
			alert("The policy name is required");
			return false;
		}
		else if( $scope.currentpolicy.description === undefined 
					|| $scope.currentpolicy.description == "" ){
			alert("A description for this policy is required");
			return false;
		}
		else if( !$scope.policycheck($scope.currentpolicy) ){
			alert("At least one permission must be added to the policy");
			return false;
		}
		
		//assign the current resourceMap to the respective ALLOW and DENY sets
		$scope.currentpolicy.allowSet = $scope.currentpolicy.resourceMap["ALLOW"];
		$scope.currentpolicy.denySet = $scope.currentpolicy.resourceMap["DENY"];
		
		PolicyService.save($scope.currentpolicy)
			.then(function(policy){
			$location.path("/access/policy/view/" + policy.id);
		});
		
	}
	
	$scope.savePermission = function(perm){
		
		if( perm.permission === undefined 
				|| perm.permission.trim() == "" ){
			alert("A permission is required");
			return false;
		}
		else if( perm.effect === undefined 
				 || perm.effect == "" ){
			alert("An effect is required for the permission");
			return false;
		}
		
		if( $scope.currentpolicy.resourceMap == undefined ){
			$scope.currentpolicy.resourceMap = {};
		}
		
		if( $scope.currentpolicy.resourceMap[perm.effect] == undefined ){
			$scope.currentpolicy.resourceMap[perm.effect] = [];
		}
		
		$global.toggle('addingpermission');
		$scope.newpermission = {};
		$scope.currentpolicy.resourceMap[perm.effect].push(perm.permission);
		
	}
	
	$scope.removepermission = function(eff,ind){
		if( confirm("Remove this permission?") ){
			$scope.currentpolicy.resourceMap[eff].splice(ind,1);
		}
		if( $scope.currentpolicy.resourceMap[eff].length == 0 ){
			delete $scope.currentpolicy.resourceMap[eff];
		}
	}
	
	var initpolicies = function(){
		var deferred = $q.defer();
		PolicyService.list().then(function(res){
			$scope.policylist = res;
			deferred.resolve("done");
		});
		return deferred.promise;
	}

	var initbc = function(){
		//finally set the breadcrumb
		$global.setbreadcrumb(breadcrumb);
	}
		
	$global.initview([initpolicies,initbc]);
	
});