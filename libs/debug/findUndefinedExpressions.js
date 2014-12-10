// http://bahmutov.calepin.co/avoiding-silent-angular-failures.html
;(function (angular) {
    "use strict";
    angular
            .module('fatoresApp')
            .filter('isDefined', function () {
                return function (value, msg) {
                    if (value === undefined) {
                        throw new Error('isDefined filter got undefined value ' + msg);
                    }
                    return value;
                };
            });
}(window.angular));