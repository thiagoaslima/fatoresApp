(function(angular, undefined) {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    function logger($log, toastr) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,
            warn: warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, dt(data));
        }

        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info: ' + message, dt(data));
        }

        function success(message, data, title) {
            toastr.success(message, title);
            $log.info('Success: ' + message, dt(data));
        }

        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warn('Warning: ' + message, dt(data));
        }
        
        function dt(data) {
            return data || new Date().toLocaleTimeString() || 
                new Date().toTimeString();
        }
    }
}(window.angular));