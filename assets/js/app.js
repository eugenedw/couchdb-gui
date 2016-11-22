var servicebus = angular.module('servicebus', [ 'ui.router', 'ui.checkbox', 'ui.tree' ]);
var appmode = "live";

// configure our routes
servicebus.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('nodelist', {
		url : '/monitor/node/list',
		templateUrl : 'app/components/node/list.html',
		controller : 'NodeCtrl'
	})
	
	.state('appedit', {
		url : '/application/edit/:id',
		templateUrl : 'app/components/application/edit.html',
		controller : 'ApplicationCtrl'
	})

	.state('appview', {
		url : '/application/view/:id',
		templateUrl : 'app/components/application/view.html',
		controller : 'ApplicationCtrl'
	})

	.state('applist', {
		url : '/application/list',
		templateUrl : 'app/components/application/list.html',
		controller : 'ApplicationCtrl'
	})

	.state('flowview', {
		url : '/flow/view/:id',
		templateUrl : 'app/components/flow/view.html',
		controller : 'FlowCtrl'
	})

	.state('flowlist', {
		url : '/flow/list',
		templateUrl : 'app/components/flow/list.html',
		controller : 'FlowCtrl'
	})

	.state('moduleview', {
		url : '/module/view/:id',
		templateUrl : 'app/components/module/view.html',
		controller : 'ModuleCtrl'
	})

	.state('modulelist', {
		url : '/module/list',
		templateUrl : 'app/components/module/list.html',
		controller : 'ModuleCtrl'
	})

	.state('policyview', {
		url : '/access/policy/view/:id',
		templateUrl : 'app/components/policy/view.html',
		controller : 'PolicyCtrl'
	})

	.state('policyedit', {
		url : '/access/policy/edit/:id',
		templateUrl : 'app/components/policy/edit.html',
		controller : 'PolicyCtrl'
	})

	.state('policylist', {
		url : '/access/policy/list',
		templateUrl : 'app/components/policy/list.html',
		controller : 'PolicyCtrl'
	})

	.state('roleview', {
		url : '/access/role/view/:id',
		templateUrl : 'app/components/role/view.html',
		controller : 'RoleCtrl'
	})

	.state('roleedit', {
		url : '/access/role/edit/:id',
		templateUrl : 'app/components/role/edit.html',
		controller : 'RoleCtrl'
	})

	.state('rolelist', {
		url : '/access/role/list',
		templateUrl : 'app/components/role/list.html',
		controller : 'RoleCtrl'
	})

	.state('userview', {
		url : '/access/user/view/:id',
		templateUrl : 'app/components/user/view.html',
		controller : 'UserCtrl'
	})

	.state('useredit', {
		url : '/access/user/edit/:id',
		templateUrl : 'app/components/user/edit.html',
		controller : 'UserCtrl'
	})

	.state('userlist', {
		url : '/access/user/list',
		templateUrl : 'app/components/user/list.html',
		controller : 'UserCtrl'
	})

	.state('home', {
		url : '/home',
		templateUrl : 'app/home.html',
		controller : 'MainCtrl'
	});

	$urlRouterProvider.otherwise('home');
	

});

servicebus.run(function($rootScope,$global){
	$rootScope.$global = $global;
});
