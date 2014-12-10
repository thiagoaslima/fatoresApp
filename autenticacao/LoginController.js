;(function(angular, undefined) {
    'use strict';
    
    angular
        .module('fatoresApp')
        .controller('LoginController', [
            '$scope',
            loginCtrl
        ]);
        
    function loginCtrl($scope) {
        var vm = this;
        
        return vm;
    }
}(window.angular));