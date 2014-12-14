;(function(angular, undefined) {
    'use strict';

    angular
        .module('logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toaster', '$rootScope'];

    function logger($log, toaster, $rootScope) {
        var service = {
            showToasts: true,
            
            error   : error,
            info    : info,
            success : success,
            warning : warning,
            warn    : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {
            service.error({
                title: 'Logger.js: Routing',
                msg: error
            });
        });

        return service;
        /////////////////////

        function error(options) {
            options.data = checkData(options.data);
            toaster.pop('error', options.title, options.msg.toString() || options.msg);
            $log.error(options.data, 'Error: ' + options.msg);
        }

        function info(options) {
            options.data = checkData(options.data);
            toaster.pop('note', options.title, options.msg.toString() || options.msg);
            $log.info(options.data, 'Info: ' + options.msg);
        }

        function success(options) {
            options.data = checkData(options.data);
            toaster.pop('success', options.title, options.msg.toString() || options.msg);
            $log.info(options.data, 'Success: ' + options.msg);
        }

        function warning(options) {
            options.data = checkData(options.data);
            toaster.pop('warning', options.title, options.msg.toString() || options.msg);
            $log.warn(options.data, 'Warning: ' + options.msg);
        }
        
        function checkData(data) {
            if (!data) {
                return new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
            }
        }
    }
}(window.angular));