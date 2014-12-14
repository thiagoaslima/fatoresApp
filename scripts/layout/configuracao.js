;
(function (angular, undefined) {
    'use strict';

    angular
            .module('app.layout')
            .controller('Configuracao', ['$scope', 'dados', Configuracao]);

    function Configuracao($scope, dados) {
        $scope.dados = dados;
    }

})(window.angular);