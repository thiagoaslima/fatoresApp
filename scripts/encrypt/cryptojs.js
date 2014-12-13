;
(function (angular, undefined) {
    'use strict';

    angular
        .module('encrypt')
        .factory('cryptojs', ['$window', cryptojs]);
    
    function cryptojs($window) {
        return $window.CryptoJS;
    }
    
})(window.angular);