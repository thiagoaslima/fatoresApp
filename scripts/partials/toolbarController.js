;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.layout')
        .controller('toolbarController', ['$state', '$rootScope', toolbarController]);
    
    function toolbarController($state, $root) {
        var vm = this;
        angular.extend(vm, $state.$current.data.toolbar);
        
        vm.toggleSidebar = function() {
            $root.sidebarOpen = !$root.sidebarOpen;
        };

        
        return vm;
    }
})(window.angular);
