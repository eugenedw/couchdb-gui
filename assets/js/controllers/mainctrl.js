couchdbgui.controller('MainCtrl',function($scope,$state,$timeout,$q,$global,DatabaseService){

    $scope.connection = {
      hostname : undefined,
      port : undefined,
      username : undefined,
      password : undefined
    }

    $global.setbreadcrumb([
  		{ path: "#/home", name: "Home" }
  	]);

    $scope.breadcrumb = function(){
      return $global.getbreadcrumb();
    }

    var checkdbconfig = function(){
      $global.localdb = new PouchDB("couchdb-gui", {adapter: 'websql'});
      if (!$global.localdb.adapter) {
        $global.localdb = new PouchDB("couchdb-gui");
      }
      $global.localdb.get("connection").then(function(doc){
        $global.connection = doc.data;
        $global.connection.status = "connecting";
        doconnect($global.connection).then(function(){
          $global.connection.status = "connected";
          $scope.connection = $global.connection;
        });
      }).catch(function(err){
        //do nothing - no configuration exists
      });
    }

    var doconnect = function(connection,store){

        var deferred = $q.defer();
        $global.database = new PouchDB(connection.hostname+":"+connection.port+"/"+connection.database,{
          auth : {
            username : connection.username,
            password : connection.password
          }
        });

        $global.connection.status = "connecting";

        $global.database.info().then(function(res){
          $global.connection.status = "connected";
          $global.connection.info = res;
          deferred.resolve("done");
        }).
        catch(function(err){
          $global.connection.status = "disconnected";
          alert("There was a problem connecting to the database: " + JSON.stringify(err));
          deferred.resolve("done");
        });
        return deferred.promise;

    }

    $scope.connect = function(){

        if( $scope.connection.hostname === undefined || $scope.connection.hostname.trim() == "" ){
          $global.alert("Form Incomplete","The hostname is required to make the connection.","Retry",function(){
            $("#displayConnectionSettings").trigger("click");
          });
          return false;
        }
        else if( $scope.connection.port === undefined || $scope.connection.port.trim() == "" ){
          $global.alert("Form Incomplete","The port is required to make the connection.","Retry",function(){
            $("#displayConnectionSettings").trigger("click");
          });
          return false;
        }
        else if( $scope.connection.database === undefined || $scope.connection.database.trim() == "" ){
          $global.alert("Form Incomplete","The database name is required.","Retry",function(){
            $("#displayConnectionSettings").trigger("click");
          });
          return false;
        }
        else if( $scope.connection.username === undefined || $scope.connection.username.trim() == ""
                  || $scope.connection.password === undefined || $scope.connection.password.trim() == "" ){
          $global.alert("Form Incomplete","Username and password are required","Retry",function(){
            $("#displayConnectionSettings").trigger("click");
          });
          return false;
        }

        if( $scope.connection.hostname.indexOf("http") != 0 ){
          $scope.connection.hostname = "http://"+$scope.connection.hostname;
        }

        $global.connection = $scope.connection;
        doconnect($global.connection).then(function(){
          var connection = { "_id": "connection", "id" : "connection", "data" : $global.connection }
          $global.localdb.put(connection)
              .then(function (response) {
                console.log("Database information stored.")
          }).catch(function (err) {
                alert(JSON.stringify(err));
                console.log(err);
          });
          console.log("connection complete.");
        });

    }

    $scope.viewconnection = function(){
      var infostring = [];
      for( k in $global.connection ){
        if( k != "password" && k != "info" ){
          infostring.push(k + " => " + $global.connection[k] );
        }
      }
      $global.alert("Database Information",infostring.join(", "));
    }

    checkdbconfig();

});
