;(function(angular, undefined) {
    'use strict';
    
    angular
        .module('fatoresApp')
        .controller('NavbarController', [
            '$scope',
            '$state',
            navbarCtrl
        ]);
        
    function navbarCtrl($scope, $state) {
        /* ViewModel sugar */
        var vm = this;
        
        vm.page = {
            title: $state.current.data.title
        };
        
        return vm;
    }
}(window.angular));