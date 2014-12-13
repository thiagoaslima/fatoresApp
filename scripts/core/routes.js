;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.core')
        .config(['$stateProvider',
            '$urlRouterProvider',
            '$locationProvider',
            routing]);

    function routing($stateProvider, $urlRouterProvider, $locationProvider) {
        // retira o # da url
        $locationProvider.html5Mode(true);

        // caso a url não seja nenhuma mapeada
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'scripts/auth/login.html',
                controller: 'Login as vm'
            })
            .state('configuracao', {
                url: '/configuracao',
                templateUrl: 'views/configuracao.html',
                controller: 'configuracaoController as vm',
                data: {
                    pageTitle: 'Configuração'
                }
            })
            .state('credits', {
                url: '/credits',
                templateUrl: 'credits.html',
                data: {
                    pageTitle: 'Credits'
                }
            });
    }

})(window.angular);