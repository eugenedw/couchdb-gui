servicebus
.factory('ModuleConfigurationService', function($http,$rootScope,$global) {
		
		var buildObjectFromSchema = function (JSONSchema, returnFunction) {
			
			if( JSONSchema === undefined ){
				return {};
			}
		
		    var walkObject = function(PROPS,type) {
		    	
		        var $this = this,
		            $child = {}
		        ;
		
		        if(returnFunction == true) {
		            $child = new function() {};
		        }
		        
		        if( type !== undefined ){
		        	$child["FIELD_TYPE"] = type;
		        }
				
		        for(var key in PROPS) {
		            console.log("key:"+key+" type:"+PROPS[key].type+" default:"+PROPS[key].default);
		            switch(PROPS[key].type) {
		                case "boolean":
		                    $child[key] = PROPS[key].default || "type:" + PROPS[key].type;
		                    break;
		                case "integer":
		                case "number":
		                    $child[key] = PROPS[key].default || "type:" + PROPS[key].type;
		                    break;
		                case "array":
		                    $child[key] = walkObject(PROPS[key].items.properties,"array");
		                    break;
		                case "object":
		                    $child[key] = walkObject(PROPS[key].properties,"object");
		                    break;
		                case "string":
		                    $child[key] = PROPS[key].default || "type:" + PROPS[key].type;
		                    break;
		            };
		        };
		
		        return $child;
		    }
		
		    return walkObject(JSONSchema.properties);
		}
				
		return {
			buildObject : buildObjectFromSchema
		}

});