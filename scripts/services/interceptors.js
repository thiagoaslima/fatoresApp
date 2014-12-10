;
(function (angular, undefined) {
    'use strict';
    angular
        .module('fatoresApp')
        .config(['$httpProvider', function ($httpProvider) {
                $httpProvider.interceptors.push('includeToken');
            }]);

    angular
        .module('fatoresApp.services')
        .factory('includeToken', includeToken);

    includeToken.$inject = ['User', '$log'];
    function includeToken(User, $log) {
        var myInterceptor = {
            request: function interceptRequest(config) {
                $log.debug(config);
                return config;
            }
        };
        return myInterceptor;
    }

}(window.angular));