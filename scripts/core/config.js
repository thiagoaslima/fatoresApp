;
(function (angular, undefined) {
    'use strict';

    var core = angular.module('app.core');

    // app Info
    var appInfo = {
        appTitle: 'Fatores App',
        version: '1.0.0'
    };
    core.value('appInfo', appInfo);

    core.config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(injectToken, spinnerOnXHR);
        }]);

    injectToken.$inject = ['dbUrl', '$injector'];
    function injectToken(dbUrl, $injector) {
        return {
            request: function (config) {
                var User = $injector.get('User');
                if (config.url.indexOf(dbUrl) === 0) {
                    config.params.token = User.getToken();
                    console.log(config);
                }
                return config;
            }
        };
    }

    spinnerOnXHR.$inject = ['dbUrl', '$q', '$rootScope', '$injector'];
    function spinnerOnXHR(dbUrl, $q, $rootScope, $injector) {
        //http://stackoverflow.com/questions/17838708/implementing-loading-spinner-using-httpinterceptor-and-angularjs-1-1-5

        var numLoadings = 0;
        function isDbUrl(url) {
            return url.indexOf(dbUrl) === 0;
        }

        return {
            request: function (config) {
                if (isDbUrl(config.url)) {
                    numLoadings++;
                    // Show loader
                    $rootScope.$broadcast("loader:show");
                }

                return config || $q.when(config);
            },
            response: function (response) {
                if (isDbUrl(response.config.url)) {
                    if ((--numLoadings) === 0) {
                        // Hide loader
                        $rootScope.$broadcast("loader:hide");
                    }
                }

                return response || $q.when(response);
            },
            responseError: function (response) {
                if (isDbUrl(response.config.url)) {
                    if (--numLoadings === 0) {
                        // Hide loader
                        $rootScope.$broadcast("loader:hide");
                    }
                }

                return $q.reject(response);
            }
        };
    }

})(window.angular);