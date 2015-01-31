;
;
;
(function (angular, undefined) {
    'use strict';

    angular
        .module('blocks.exception')
        .factory('exception', ['logger', exception]);

    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function (reason) {
                logger.error(message, reason);
            };
        }
    }
})(window.angular);