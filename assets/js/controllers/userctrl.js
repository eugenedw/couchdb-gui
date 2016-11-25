couchdbgui.controller('UserCtrl',
		function($scope,$stateParams,$state,$global,$location,$q,UserService){

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

	$global.initview([initusers,initbc]);

});
