;
(function (angular, undefined) {
    'use strict';

    angular
        .module('fatoresApp.controllers')
        .controller('configuracaoCOntroller', configuracaoCtrl);
    
    configuracaoCtrl.$inject = ['$scope', 'ConfiguracaoModel'];
    function configuracaoCtrl($scope, model) {
        ctrl.empresas = model.empresas;
        
    }
});