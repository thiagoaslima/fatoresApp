;
(function (angular) {
    'use strict';

    angular
        .module('fatoresApp')
        .config([
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider',
            routing
        ]);

    function routing($stateProvider, $urlRouterProvider, $locationProvider) {
        // retira o # da url
//        $locationProvider.html5Mode(true);

        // caso a url não seja nenhuma mapeada
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                data: {
                    title: 'Login'
                },
                views: {
                    'navbar': {
                        templateUrl: 'commons/navbar.html',
                        controller: 'NavbarController as vm'
                    },
                    'main': {
                        templateUrl: 'autenticacao/login.html',
                        controller: 'LoginController as vm'
                    }
                }
            });
    }
}(window.angular));