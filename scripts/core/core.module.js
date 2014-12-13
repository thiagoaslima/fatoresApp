(function (angular, undefined) {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAria',
        'ngMessages',
        'ngLocale',
        'ngResource',
        'ngSanitize',
        'ngMaterial',

        /*
         * Our reusable cross app code modules
         */
        'encrypt',

        /*
         * 3rd Party modules
         */
        'toaster',
        'ui.router',
        'LocalStorageModule',
        'app.directives'
    ]);
})(window.angular);