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
//        'ngMaterial',

        /*
         * Our reusable cross app code modules
         */
        'encrypt',
        'logger',

        /*
         * 3rd Party modules
         */
        'toaster',
        'ui.router',
        'ui.bootstrap',
        'LocalStorageModule'
    ]);
})(window.angular);