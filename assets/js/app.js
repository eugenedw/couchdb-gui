var couchdbgui = angular.module('couchdb-gui', [ 'ui.router', 'ui.checkbox', 'ui.tree', 'infinite-scroll' ]);
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000)
var appmode = "live";

// configure our routes
couchdbgui.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('editview', {
		url : '/design/view/edit/:id',
		templateUrl : 'app/components/design/view/edit.html',
		controller : 'DatabaseCtrl'
	})

	.state('viewlist', {
		url : '/design/view/list',
		templateUrl : 'app/components/design/view/list.html',
		controller : 'DatabaseCtrl'
	})

	.state('documentview', {
		url : '/documents/view/:id',
		templateUrl : 'app/components/document/view.html',
		controller : 'DocumentCtrl'
	})

	.state('documentlist', {
		url : '/documents/list',
		templateUrl : 'app/components/document/list.html',
		controller : 'DocumentCtrl'
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
		templateUrl : 'app/home.html'
	});

	$urlRouterProvider.otherwise('home');

});

couchdbgui.run(function($rootScope,$global){
	$rootScope.$global = $global;
});
