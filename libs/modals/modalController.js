;
(function (angular, undefined) {
    'use strict';

    var modalMod = angular.module('ModalModule');

    /* Controller */
    modalMod.controller('modalController', modalController);
    modalController.$inject = ['$scope', '$timeout'];
    function modalController($scope, $timeout) {
        $scope.modal = {
            show: false,
            title: '',
            content: '',
            type: ''
        };

        $scope.on('modal.open', function (opts) {
            $scope.modal.show = true;
        });
        
        $scope.on('modal.close', function() {
            $scope.modal.show = false;
        });
    }

}(window.angular));