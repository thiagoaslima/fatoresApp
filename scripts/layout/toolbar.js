;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.layout')
        .controller('Toolbar', ['$scope', '$state', Toolbar]);
    
    function Toolbar($scope, $state) {
        var vm = this; 
        
        return vm;
    }
    
})(window.angular);