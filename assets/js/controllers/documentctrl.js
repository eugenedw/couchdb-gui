couchdbgui.controller('DocumentCtrl',
		function($scope,$stateParams,$rootScope,$state,$q,$global,$interval,$timeout,$window,DocumentService,ViewService){

			var breadcrumb = [
				$global.defaults.breadcrumb,
				{ path: "#/documents/list", name: "Documents" }
			];

			//broadcast listeners
			$rootScope.$on("savedocument",function(ev,par){
				alert("[SAVING]" + JSON.stringify(par));
			});

			//scope variables
			$scope.documentlist = [];
			$scope.viewlist = [];
			$scope.docquery = {
				"limit" : 100,
				"page" : 0
			}
			$scope.filter = {};
			$scope.currentdocument = {};

			//private methods
			var initdocs = function(){
				var deferred = $q.defer();
				$scope.docintcount = 0;
				$scope.docget = $interval(function(){
					if( $global.database !== undefined ){
						loaddocs();
						deferred.resolve("done");
						$interval.cancel($scope.docget);
					}
					else if( $scope.docintcount > 5 ){
						$interval.cancel($scope.docget);
					}
					$scope.docintcount++;
				},1000);
				return deferred.promise;
			}

			var initviews = function(){
				var deferred = $q.defer();
				$scope.viewinitcount = 0;
				$scope.viewget = $interval(function(){
					if( $global.database !== undefined ){
						loadviews();
						deferred.resolve("done");
						$interval.cancel($scope.viewget);
					}
					else if( $scope.viewinitcount > 5 ){
						$interval.cancel($scope.viewget);
					}
					$scope.viewinitcount++;
				},1000);
				return deferred.promise;
			}

			var initbc = function(){
				$global.setbreadcrumb(breadcrumb);
			}

			var loaddocs = function(init){

					if( init ){
						$scope.docquery.page = 0;
						$scope.documentlist = [];
					}
					if( $scope.filter !== undefined && $scope.filter.view !== undefined && $scope.filter.view != "" ){
						var _viewname = $scope.filter.view.replace("_design/","");
						ViewService.view(_viewname,{"page":$scope.docquery.page,"size":$scope.docquery.limit}).then(function(docs){
							$scope.documentlist = $scope.documentlist.concat(docs);
						});
					}
					else{
						DocumentService.list($scope.docquery.page,$scope.docquery.limit).then(function(res){
							$scope.documentlist = $scope.documentlist.concat(res);
						});
					}

			}

			var loadviews = function(){

				ViewService.list().then(function(res){
						$scope.viewlist = res;
				});

			}

			if( $state.current.name == 'documentview'
				 || $state.current.name == 'documentedit' ){
			}

			//scope methods
			$scope.getmoredocs = function(){
				if( $global.database !== undefined ){
					$scope.docquery.page++;
					loaddocs();
				}
			}

			$scope.filtercheck = function(doc){
				if( $scope.filter === undefined || $scope.filter.fieldname === undefined || $scope.filter.fieldvalue === undefined
							|| $scope.filter.fieldname.trim() == "" || $scope.filter.fieldvalue.trim() == "" ){
					return true;
				}
				if( doc[$scope.filter.fieldname] !== undefined
							&& doc[$scope.filter.fieldname].toLowerCase().indexOf($scope.filter.fieldvalue) > -1){
					return true;
				}
				return false;
			}

			$scope.docsbyview = function(){
				loaddocs(true);
			}

			$scope.showdocument = function(docid){
				DocumentService.get(docid).then(function(doc){
					$global.currentdocument = doc;
					$("#viewDocumentModal").modal("show");
				});
			}

			//initialize scope
			$global.initview([initdocs,initviews,initbc]);

});
