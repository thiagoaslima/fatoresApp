;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.layout')
        .controller('toolbarController', ['$state', toolbarController]);
    
    function toolbarController($state) {
        var vm = this;
        angular.extend(vm, $state.$current.data.toolbar);
        return vm;
    }
})(window.angular);
