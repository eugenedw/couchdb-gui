servicebus.directive('capitalize', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attrs, modelCtrl) {
			var capitalize = function(inputValue) {
				if (inputValue == undefined)
					inputValue = '';
				var capitalized = inputValue.toUpperCase();
				if (capitalized !== inputValue) {
					modelCtrl.$setViewValue(capitalized);
					modelCtrl.$render();
				}
				return capitalized;
			}
			modelCtrl.$parsers.push(capitalize);
			capitalize(scope[attrs.ngModel]); // capitalize initial value
		}
	};
}).directive('nospace', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attrs, modelCtrl) {
			var nospace = function(inputValue) {
				if (inputValue == undefined)
					inputValue = '';
				var nospace = inputValue.replace(/ /g,"_");
				if (nospace !== inputValue) {
					modelCtrl.$setViewValue(nospace);
					modelCtrl.$render();
				}
				return nospace;
			}
			modelCtrl.$parsers.push(nospace);
			nospace(scope[attrs.ngModel]); // replace space in the initial value
		}
	};
}).directive('textlimit', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attrs, modelCtrl) {
			var max = attrs.maxlength;
			var $el = $(element);
			var limit = function(inputValue) {
				if (inputValue == undefined)
					inputValue = '';
				if( max === undefined ){
					return inputValue;
				}
				else{
					if( inputValue.length > max ){
						inputValue = inputValue.substring(0,max);
					}
				}
				$el.siblings(".count-info").remove();
				$el.after("<small class='count-info'>" + inputValue.length + " of " + max + "</small>");
				return inputValue;
			}
			modelCtrl.$parsers.push(limit);
			limit(scope[attrs.ngModel]); // replace space in the initial value
		}
	};
}).directive('numeric', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attrs, modelCtrl) {
			var numeric = function(inputValue) {
				if (inputValue == undefined)
					inputValue = '';
				var numeric = inputValue.replace(/[^0-9]/g,"");
				if (numeric !== inputValue) {
					modelCtrl.$setViewValue(numeric);
					modelCtrl.$render();
				}
				return numeric;
			}
			modelCtrl.$parsers.push(numeric);
			numeric(scope[attrs.ngModel]); // replace space in the initial value
		}
	};
});