(function (angular, undefined) {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate',
        'ngAria',
        'ngMessages',
        'ngLocale',
        'ngResource',
        'ngSanitize',

        /*
         * Our reusable cross app code modules
         */
        'encrypt',
        'blocks.logger',
        'blocks.exception',

        /*
         * 3rd Party modules
         */
        'ui.router',
        'ui.bootstrap',
        'LocalStorageModule'
    ]);
})(window.angular);