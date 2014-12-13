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
    
})(window.angular);