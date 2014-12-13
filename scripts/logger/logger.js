;(function(angular, undefined) {
    'use strict';

    angular
        .module('app.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toaster'];

    function logger($log, toaster) {
        var service = {
            showToasts: true,
            
            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            data = checkData(data);
            toaster.pop('error', title, message);
            $log.error('Error: ' + message, data );
        }

        function info(message, data, title) {
            data = checkData(data);
            toaster.pop('note', title, message);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            data = checkData(data);
            toaster.pop('success', title, message);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            data = checkData(data);
            toaster.pop('warn', title, message);
            $log.warn('Warning: ' + message, data);
        }
        
        function checkData(data) {
            if (!data) {
                return new Date().toLocaleDateString();
            }
        }
    }
}(window.angular));