servicebus.factory('DAO', function($http, $q, $rootScope, $timeout, $global, $location, $anchorScroll) {

					var _list = function(page, size, _url) {

						if (page === undefined) {
							page = 1;
						}
						if (size === undefined) {
							size = this.defaults.pagesize;
						}

						_url = _url.replace(/\{page\}/g, page);
						_url = _url.replace(/\{size\}/g, size);

						var req = $http({
							method : "get",
							url : _baseurl + _url
						}).then(function(res) {
							if (res.data.applicationlist) {
								return res.data.applicationlist;
							} else {
								return res.data;
							}
						}, function(res) {
							console.log("No applications returned...")
						});
						return req;

					}

					var _save = function(obj, url) {

						var req = $http({
							method : "post",
							data : obj,
							url : _baseurl + url,
							headers : {
								'Content-type' : 'application/json'
							}
						})
						.then(
								function(res) {
									return res.data;
								},
								function(res) {
									return res;
								});

						return req;

					}

					var _getById = function(id, url) {

						url = url.replace(/\{id\}/g, id);
						var req = $http({
							cache: false,
							method : "get",
							url : _baseurl + url + "?_=" + (new Date()).getTime()
						}).then(function(res) {
							return res.data
						}, function(res) {
							console.log("No data returned...")
						});
						return req;

					}

					var _delete = function(id, url) {

						url = url.replace(/\{id\}/g, id);
						var req = $http({
							method : "delete",
							url : _baseurl + url
						}).then(function(res) {
							return res.data;
						}, function(res) {
							console.log(res);
						});

						return req;

					}

					return {
						defaults : {
							pagesize : 10
						},
						list : _list,
						save : _save,
						remove : _delete,
						get : _getById,
						HttpStatus : {
							CONFLICT : "409",
							NOT_FOUND : "404",
							SERVER_ERROR : "500",
							NO_CONTENT : "204"
						},
						REST : {
							user : {
								"list" : "/manage/access/user/list/{page}/{size}",
								"save" : "/manage/access/user",
								"remove" : "/manage/access/user/{id}",
								"get" : "/manage/access/user/{id}",
								"addkey" : "/manage/access/user/{id}/key"
							},
							policy : {
								"list" : "/manage/access/policy/list/{page}/{size}",
								"save" : "/manage/access/policy",
								"remove" : "/manage/access/policy/{id}",
								"get" : "/manage/access/policy/{id}"
							},
							role : {
								"list" : "/manage/access/role/list/{page}/{size}",
								"save" : "/manage/access/role",
								"remove" : "/manage/access/role/{id}",
								"get" : "/manage/access/role/{id}"
							},
							application : {
								"list" : "/manage/app/list/{page}/{size}",
								"save" : "/manage/app",
								"remove" : "/manage/app/{id}",
								"get" : "/manage/app/{id}"
							},
							module : {
								"list" : "/manage/module/list/{page}/{size}",
								"save" : "/manage/module",
								"remove" : "/manage/module/{id}",
								"get" : "/manage/module/{id}"
							},
							moduleconfiguration : {
								"get" : "/manage/module/configuration/{id}",
								"save" : "/manage/module/{id}/configuration",
							},
							node : {
								"list" : "/manage/node/list/{page}/{size}",
							}
						}
					}

});