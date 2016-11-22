servicebus.controller('UserCtrl',
		function($scope,$stateParams,$state,$global,$location,$q,UserService,PolicyService,RoleService){

	var breadcrumb = [
		$global.defaults.breadcrumb,
		{ path: "#/access/user/list", name: "Users" }
	];
	
	$scope.userlist = [];
	$scope.currentuser = {};
	$scope.allpolicies = [];
	$scope.allroles = [];
	$scope.currentpolicies = [];
	$scope.currentroles = [];
	
	if( $state.current.name == 'userview'
		 || $state.current.name == 'useredit' ){
		
		if( $stateParams.id != "new"){
			UserService.get($stateParams.id).then(function(user){
				$scope.currentuser = user;
				if( $scope.currentuser.policySet !== undefined
					&& $scope.currentuser.policySet != null ){
					$scope.currentuser.policySet.sort(function(p1,p2){
						return p1.name > p2.name;
					});
					angular.forEach($scope.currentuser.policySet,function(pol,k){
						$scope.currentpolicies[pol.id] = true;
					});
				}
				if( $scope.currentuser.roleSet !== undefined 
					&& $scope.currentuser.roleSet != null ){
					$scope.currentuser.roleSet.sort(function(r1,r2){
						return r1.name > r2.name;
					});
					angular.forEach($scope.currentuser.roleSet,function(rol,k){
						$scope.currentroles[rol.id] = true;
					});
				}
				breadcrumb.push({ path: "#/access/user/view/" + $stateParams.id, name: user.name });
			});
		}
		else{
			$scope.currentuser = {};
		}
	}
	
	$scope.saveUser = function(){
		
		if( $scope.currentuser.name === undefined 
				|| $scope.currentuser.name == "" ){
			alert("The user name is required");
			return false;
		}
		else if( $scope.currentuser.description === undefined 
					|| $scope.currentuser.description == "" ){
			alert("A description for this user is required");
			return false;
		}
		
		UserService.save($scope.currentuser)
			.then(function(user){
			$location.path("/access/user/view/" + user.id);
		});
		
	}
	
	$scope.adduserkey = function(){
		
		if( confirm("Generate a new key for this user?" +
				"\n(WARNING: the current API key will be automatically revoked).")){
			UserService.addkey($scope.currentuser.id)
				.then(function(user){
				$scope.currentuser = user;
			});
		}
		
	}
	
	$scope.revokeuserkey = function(key){
		if( confirm("Revoke this user key?") ){
			angular.forEach($scope.currentuser.keySet,function(k,i){
				if( k.key == key ){
					k.revoked = "true";
				}
			});
			UserService.save($scope.currentuser)
				.then(function(user){
				$location.path("/access/user/view" + user.id);
			});
		}
	}
	
	$scope.updatepolicies = function(){
		var addedpolicies = [];
		for( var permid in $scope.currentpolicies){
			if( $scope.currentpolicies[permid] ){
				addedpolicies.push($global.findById($scope.allpolicies,permid));
			}
		};
		$scope.currentuser.policySet = addedpolicies;
	}
	
	$scope.updateroles = function(){
		var addedroles = [];
		for( var roleid in $scope.currentroles){
			if( $scope.currentroles[roleid] ){
				addedroles.push($global.findById($scope.allroles,roleid));
			}
		};
		$scope.currentuser.roleSet = addedroles;
	}
	
	var initroles = function(){
		var deferred = $q.defer();
		RoleService.list().then(function(res){
			$scope.allroles = res;
			deferred.resolve(res);
		});
		return deferred.promise;
	}
	
	var initpolicies = function(){
		var deferred = $q.defer();
		PolicyService.list().then(function(res){
			$scope.allpolicies = res;
			deferred.resolve(res);
		});
		return deferred.promise;
	}
	
	var initusers = function(){
		var deferred = $q.defer();
		UserService.list().then(function(res){
			$scope.userlist = res;
			deferred.resolve("done");
		});
		return deferred.promise;
	}

	var initbc = function(){
		//finally set the breadcrumb
		$global.setbreadcrumb(breadcrumb);
	}
		
	$global.initview([initusers,initpolicies,initroles,initbc]);
	
});