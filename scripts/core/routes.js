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
                controller: 'Login as vm',
                resolve: {
                    'wakeup': ['$q', 'dataservice', function ($q, dataservice) {
                            var defer = $q.defer();
                            dataservice.get({
                                item: 'token',
                                username: '',
                                password: ''
                            }, 0.01).finally(function () {
                                defer.resolve();
                            });
                            return defer.promise;
                        }]
                }
            })
            .state('configuracao', {
                url: '/configuracao',
                templateUrl: 'scripts/layout/configuracao.html',
                controller: 'Configuracao as vm',
                data: {
                    pageTitle: 'Configuração'
                },
                resolve: {
                    'loadData': ['Entidades', function (Entidades) {
                            return Entidades.init();
                        }]
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