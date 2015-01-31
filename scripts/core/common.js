;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.core')
        .factory('common', ['$q', '$state', 'logger', common]);

    function common($q, $state, logger) {
        var routes = {
            to: routesTo
        };

        var service = {
            'routes': routes,
            'promise': $q
        };

        return service;

        function routesTo(state) {
            logger.info(
                'Going to ' + state,
                null,
                'common.js: Route'
                );
            $state.go(state);
        }
    }

})(window.angular);