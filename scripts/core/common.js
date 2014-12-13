;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.core')
        .factory('common', ['$q', '$state', common]);
    
    function common($q, $state) {
        var service = {
            'routes': routes,
            'promise': $q
        };
        
        var routes = {
            to: $state.go
        };
        
        return service;
    }
    
})(window.angular);