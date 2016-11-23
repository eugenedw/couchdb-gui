servicebus.controller('DatabaseCtrl',
		function($scope,$stateParams,$state,$timeout,$location,$global,$q,$anchorScroll,DatabaseService,DAO){

	var breadcrumb = [
		$global.defaults.breadcrumb,
		{ path: "#/application/list", name: "Applications" }
	];

	$scope.currentapplication = undefined;
	$scope.modulelist = [];
	$scope.applicationlist = [];
	$scope.currentflow = {};
	$scope.appeditor = {};
	$scope.initialExec = [];
	$scope.assignedExecutionNodeTrigger = [];
	$scope.triggermap = [];
	$scope.triggerConfig = {
			selectedTrigger : undefined,
			selectedExecution : undefined
	}

	$scope.assignedExecutionNodes = [];

	$scope.moduleselects = [{'id':'-1','name':'Select a Module to Attach'}];

	var initmodules = function(){
		var deferred = $q.defer();
		ModuleService.list().then(function(res){
			$scope.modulelist = res;
			$scope.moduleselects = $scope.moduleselects.concat(res);
			deferred.resolve("done");
		});
		return deferred.promise;
	}


	if( $state.current.name == 'appview'
		 || $state.current.name == 'appedit' ){

		initmodules();

		$global.toggle('edit-application-flow','hide');
		$global.toggle('view-application-flow','hide');
		$global.toggle('show-application-flows','hide');

		if( $stateParams.id != "new"){
			ApplicationService.get($stateParams.id).then(function(app){
				$scope.currentapplication = app;
				buildapplicationview(app);
				breadcrumb.push({ path: "#/application/view/" + $stateParams.id, name: app.name });
			});
		}
		else{
			$scope.currentapplication = {};
		}
	}

	var initbc = function(){
		//finally set the breadcrumb
		$global.setbreadcrumb(breadcrumb);
	}

	var initapps = function(){
		ModuleService.list().then(function(mods){
			ApplicationService.list().then(function(res){
				$scope.applicationlist = res;
			});
		});
	}

	var initjs = function(){
		$timeout(function(){
			//$(".datepicker").datepicker();
		},1000);
	}

	/**
	 * gathers executions available for a specific application
	 */
	var configureAssignedExecutions = function(app){
		var ind = 0;
		for( var flow in app.flowSet ){
			if( flow.triggerMap === undefined || flow.triggerMap == null || flow.triggerMap.length == 0 ){
				$scope.assignedExecutionNodes["flow_" + ind] = [];
			}
			ind++;
		}
	}


	/**
	 * builds and stores the list of available triggers associated with a
	 * particular application flow
	 */
	var setupflowtriggers = function(app){
		$timeout(function(){
			if( $scope.triggermap[app.id] === undefined ){
				$scope.triggermap[app.id] = [];
			}
			angular.forEach(app.flowSet,function(flow,k){
				$scope.triggermap[app.id][flow.name] = {};
				var triggerlist = {};
				angular.forEach(flow.executionSet,function(ex,k){
					angular.forEach(ex.moduleReference.eventSet,function(ev,m){
						if( triggerlist[ex.moduleReference.name] === undefined ){
							triggerlist[ex.moduleReference.name] = [];
						}
						if( triggerlist[ex.moduleReference.name].indexOf(ev) < 0 ){
							triggerlist[ex.moduleReference.name].push(ev);
						}
					});
				});
				$scope.triggermap[app.id][flow.name] = triggerlist;
			});
		},3000);
	}

	var buildapplicationview = function(app){
		setupflowtriggers(app);
		configureAssignedExecutions(app);
	}

	$scope.getmodule = function(modid){
		var retmod = {};
		angular.forEach($scope.modulelist,function(mod,k){
			if( mod.id == modid ){
				retmod = mod;
			}
		});
		return retmod;
	}

	$scope.resetTriggerConfig = function(){
		$scope.triggerConfig = {
				selectedExecution:undefined,
				selectedTrigger:undefined
		};
	}

	/**
	 * saves the trigger configuration that is currently staged
	 * in the flow trigger editor
	 */
	$scope.saveTriggerConfig = function(){
		if( $scope.currentflow.triggerMap[$scope.triggerConfig.selectedTrigger.event] === undefined ){
			$scope.currentflow.triggerMap[$scope.triggerConfig.selectedTrigger.event] = [];
		}
		$scope.currentflow.triggerMap[$scope.triggerConfig.selectedTrigger.event].push($scope.triggerConfig.selectedExecution.id);
		$scope.triggerConfig = {
				selectedExecution:undefined,
				selectedTrigger:undefined
		};
	}

	/**
	 * preps the screen for editing a flow
	 * @param the flow being edited
	 */
	$scope.prepareFlowEdit = function(flow){

		var configureInitialExecutionCB = function(flow){
			angular.forEach(flow.executionSet,function(exec,p){
				if( exec.id == flow.initial ){
					$scope.initialExec[exec.id] = true;
				}
			});
		}

		$scope.currentflow = flow;
		$scope.currentflow.existing = true;

		if( flow.initial ){
			$scope.currentflow.initialExec = {};
			$scope.currentflow.initialExec[flow.initial] = true;
		}

		configureInitialExecutionCB(flow);

		$global.toggle('edit-application-flow','show');
		$global.toggle('view-application-flow','hide');
		$global.toggle('show-application-flows','hide');
		breadcrumb = [
	              		$global.defaults.breadcrumb,
	            		{ path: "#/application/list", name: "Applications" },
	              		{ path: "#/application/view/" + $stateParams.id, name: $scope.currentapplication.name },
	            		{ js: "prepareFlowList()", name: "Flows" },
	            		{ js: "", name: flow.name }
	            	 ];
		initbc();

	}

	/**
	 * prepares the data for displaying the list of flows,
	 * progressing the wizard to the next screen
	 */
	$scope.prepareFlowList = function(){
		$global.toggle('show-application-flows','show');
		$global.toggle('edit-application-flow','hide');
		$global.toggle('view-application-flow','hide')
		breadcrumb = [
	              		$global.defaults.breadcrumb,
	            		{ path: "#/application/list", name: "Applications" },
	              		{ path: "#/application/view/" + $stateParams.id, name: $scope.currentapplication.name },
	            		{ path: "#/application/view/", name: "Flows" }
	            	 ];
		initbc();
	}

	/**
	 * prepares the wizard screen for adding a new flow to
	 * an existing application
	 */
	$scope.prepareFlowAdd = function(){
		$scope.currentflow = {};
		$global.toggle('edit-application-flow','show');
		$global.toggle('view-application-flow','hide');
		$global.toggle('show-application-flows','hide');
		breadcrumb = [
	              		$global.defaults.breadcrumb,
	            		{ path: "#/application/list", name: "Applications" },
	              		{ path: "#/application/view/" + $stateParams.id, name: $scope.currentapplication.name },
	            		{ js: "prepareFlowList()", name: "Flows" },
	            		{ js: "", name: "Add Flow" }
	            	 ];
		initbc();
	}

	/**
	 * prepares the screen for viewing a flow
	 */
	$scope.prepareFlowView = function(flow){
		$scope.currentflow=flow;
		$global.toggle('edit-application-flow','hide');
		$global.toggle('view-application-flow','show');
		$global.toggle('show-application-flows','hide');
		breadcrumb = [
	              		$global.defaults.breadcrumb,
	            		{ path: "#/application/list", name: "Applications" },
	              		{ path: "#/application/view/" + $stateParams.id, name: $scope.currentapplication.name },
	            		{ js: "prepareFlowList()", name: "Flows" },
	            		{ js: "", name: flow.name }
	            	 ];
		initbc();
	}

	$scope.removeNode = function(scope){
		scope.remove();
	}

	$scope.appeditor.modref = "-1";
	$scope.addExecutionToFlow = function(flow,mod){

		if( mod != "-1" ){
			if( flow.executionSet === undefined ){
				flow.executionSet = [];
			}
			var exec = new FlowExecution();
			var mr = $scope.getmodule(mod);
			exec.id = $global.guid();
			exec.setModuleReference(mr);
			flow.executionSet.push(exec);
			$global.scrollto("flowExecution_"+(flow.executionSet.length-1));
			$scope.saveFlowToApplication($scope.currentflow);
		}
		$timeout(function(){
			$scope.appeditor.modref = "-1";
		},500);

	}

	$scope.deleteApplication = function(app){
		var appname = app.name;
		var flowcount = app.flowSet !== undefined?app.flowSet.length:0;
		$global.confirm("Delete Application \"" + appname+"\"","Are you sure you'd like to delete this application that has " + flowcount + " flow(s)? (Note: This action cannot be reversed)",
							"Delete",
							function(){
								var _appid = app.id;
								ApplicationService.remove(app.id).then(function(){
									var applist = [];
									angular.forEach($scope.applicationlist,function(capp,k){
										if(capp.id != _appid){
											applist.push(capp);
										}
									});
									$scope.applicationlist = applist;
									$global.showbanner("Application Deleted.");
								});
							},
							"btn-danger");
	}

	$scope.deleteFlowFromApplication = function(mid){
		$global.confirm("Delete This Flow","Would you like to remove this flow and all associated executions? This action is can not be reversed.","Delete",function(){
			$scope.currentapplication.flowSet.splice(mid,1);
			$scope.saveApplication(true);
		},"btn-warning")
	}

	$scope.deleteExecutionFromFlow = function(flow,mid){
		var newlist = [];
		for( exec in flow.executionSet ){
			if( exec != mid ){
				newlist.push(flow.executionSet[exec]);
			}
		}
		flow.executionSet = newlist;
	}

	$scope.saveFlowToApplication = function(flow){

		if( flow.name === undefined
				|| flow.name == "" ){
			alert("Please provide a name for this flow.");
			return false;
		}
		else if( flow.description === undefined
				|| flow.description == "" ){
			alert("Please provide a description for this flow.");
			return false;
		}
		else{

			if( flow.existing === undefined
					|| !flow.existing ){
				var newFlow = new ApplicationFlow();
				newFlow.buildApplicationFlow(flow);
				if( $scope.currentapplication.flowSet === undefined ){
					$scope.currentapplication.flowSet = [];
				}
				$scope.currentapplication.flowSet.push(newFlow);
				flow.existing = true;
			}
			else{
				//find the existing flow and replace with what's being saved
				angular.forEach($scope.currentapplication.flowSet,function(fl,k){
					if( fl.name == flow.name ){
						$scope.currentapplication.flowSet[k] = flow;
					}
				});
			}

			$scope.currentflow=flow;
			$global.toggle('edit-application-flow','show');
			$global.toggle('view-application-flow','hide');
			$global.toggle('show-application-flows','hide');

			$global.showbanner("Flow successfully saved to " + $scope.currentapplication.name + ".")

			$scope.saveApplication(true);
		}

	}

	$scope.saveApplication = function(hold){

		if( $scope.currentapplication.name === undefined
				|| $scope.currentapplication.name == "" ){
			alert("The application name is required.");
			return false;
		}

		if( $scope.currentapplication.description === undefined
				|| $scope.currentapplication.description == ""){
			alert("A description for this application must be provided.");
			return false;
		}

		if( $global.toggledef("saveapplication") ){
			return false;
		}

		$global.toggle("saveapplication");
		ApplicationService.save($scope.currentapplication)
			.then(function(app){
				//there may have been a conflict
				if( app.status == DAO.HttpStatus.CONFLICT ){

					var domerge = false;
					if (confirm("The item being saved is in conflict with that which is in the database. " +
							" Would you like to attempt to merge your changes?")) {
						domerge = true;
					}

					ApplicationService.get($scope.currentapplication.id).then(function(cobj){
						if( domerge ){
							var newobj = _.merge($scope.currentapplication,cobj);
							$scope.currentapplication = newobj;
							buildapplicationview(newobj);
							$global.confirm("Merge Complete","The merge has completed processing. To accept the application as displayed, please click \"Save\" in the editor.")
						}
						else{
							$scope.currentapplication = cobj;
						}
						$global.toggle("saveapplication");
					});

				}
				else{
					$global.toggle("saveapplication");
					if( !hold ){
						$location.path("/application/view/" + app.id);
					}
					else{
						$scope.currentapplication = app;
						buildapplicationview(app);
					}
				}
		});

	}

	$scope.checkflowstate = function(flow,tab){
		if( flow.existing ){
			$global.setActiveTab('appedit',tab)
			return true;
		}
		else{
			$global.setActiveTab('appedit','general-settings');
			return false;
		}
	}

	$scope.setInitialExecution = function(flow,execid){
		if( flow.initialExec[execid] ){
			flow.initial = "";
			for( var k in flow.initialExec ){
				flow.initialExec[k] = false;
			}
			flow.initialExec[execid] = true;
			flow.initial = execid;
		}
	}

	$scope.getexecutioncount = function(flowset){
		var excount = 0;
		for( i in flowset ){
			for( j in flowset[i].executionSet ){
				excount++;
			}
		}
		return excount;
	}

	$scope.getexecution = function(flow,exid){
		var ex = {};
		for( e in flow.executionSet ){
			if( flow.executionSet[e].id == exid ){
				ex = flow.executionSet[e];
			}
		}
		return ex;
	}

	$scope.getargumentname = function(modref,arg){
		var displayname = arg;
		angular.forEach(modref.argumentSet,function(a,k){
			var nametocheck = arg;
			if( nametocheck.indexOf("encrypted") == 0 ){
				nametocheck = nametocheck.split(":")[1];
			}
			if( a.name == nametocheck ){
				displayname = a.display;
			}
		});
		return displayname;
	}

	$scope.getissensitive = function(modref,arg){
		var sensitive = false;
		if( modref !== undefined && modref.argumentSet !== undefined ){
			angular.forEach(modref.argumentSet,function(a,k){
				var nametocheck = arg;
				if( nametocheck.indexOf("encrypted") == 0 ){
					nametocheck = nametocheck.split(":")[1];
				}
				if( a.name == nametocheck && a.sensitive ){
					sensitive = true;
				}
			});
		}
		return sensitive;
	}

	$scope.getexecutionlist = function(flow){
		var execlist = [];
		angular.forEach(flow.executionSet,function(ex,k){
			execlist.push(ex);
		});
		return execlist;
	}

	$scope.gettriggerlist = function(flow){
		var triggerlist = {};
		angular.forEach(flow.executionSet,function(ex,k){
			angular.forEach(ex.moduleReference.eventSet,function(ev,m){
				if( triggerlist[ex.moduleReference.name] === undefined ){
					triggerlist[ex.moduleReference.name] = [];
				}
				if( triggerlist[ex.moduleReference.name].indexOf(ev) < 0 ){
					triggerlist[ex.moduleReference.name].push(ev);
				}
			});
		});
		console.log(JSON.stringify(triggerlist));
		return triggerlist;
	}

	$scope.validateflowenable = function(flow){
		var hasinitial = true;
		var hasexecutions = true;
		var hastriggermap = true;
		if( flow.initial === undefined || flow.initial == null || flow.initial == "" ){
			hasinitial = false;
		}
		if( flow.executionSet === undefined || flow.executionSet.length == 0 ){
			hasexecutions = false;
		}
		if( angular.equals({},flow.triggerMap) ){
			hastriggermap = false;
		}
		$timeout(function(){
			if( flow.enabled && (!hasinitial || !hasexecutions || !hastriggermap) ){
				$global.confirm("Flow Configuration Incomplete",
									"The flow cannot be enabled as it is not fully-configured. Please ensure that executions are added, that an initial execution is set, and that publishable events are associated to their respective executions.")
				flow.enabled = false;
			}
		},500);
	}

	$global.initview([initapps,initbc,initjs]);


});
