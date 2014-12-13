;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.auth')
        .factory('authService', ['logger', authService]);

    /**
     * authService
     * responsável por
     *      login
     *      logout
     *      confirmar se usuário está logado
     * @returns {undefined}
     */
    function authService(logger) {
        var _login = {};

        var service = {
            login: login,
            logout: logout,
            isLogged: loginStatus,
            loginMethod: loginMethod
        };

        init();

        return service;

        function init() {
            logout();
            logger.info('authService initialized');
        }

        function loginStatus() {
            return _login.status;
        }

        function loginMethod() {
            return _login.method;
        }


        function login() {
        }

        function logout() {
            _login.status = false;
            _login.method = null;
        }
    }

})(window.angular);