;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.layout')
        .controller('footerController', ['$scope', '$state', footerController]);
    
    function footerController($scope, $state) {
        var vm = this;
        vm.buttons = {};
        angular.extend(vm.buttons, $scope.$parent.buttons);
        
        var stateBtns = $state.$current.data.footer.buttons || {};
        var vmBtns = vm.buttons;
//        var parentBtns = $scope.$parent.buttons || {};
        
        
        Object.keys(stateBtns).forEach(function(key) {
            var sb = stateBtns[key];
            if (vmBtns[key]) {
                var vb = vmBtns[key];
                Object.keys(sb).forEach(function(prop) {
                    if (prop.indexOf('$$') === 0) {
                        return;
                    }
                    if (typeof vb[prop] === 'undefined') {
                        vb[prop] = sb[prop];
                    }
                });
            }
        });
        return vm;
    }
})(window.angular);
