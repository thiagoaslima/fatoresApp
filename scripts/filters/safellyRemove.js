;
(function (angular, undefined) {
    "use strict";

    angular.module('app.filters')
	.filter('safellyRemove', safellyRemove);

    function safellyRemove() {
	return function (array, el) {
	    var idx = array.indexOf(el);
	    if (idx > -1) {
		array.splice(idx, 1);
	    }
	    return array;
	};
    }

}(window.angular));