;
(function (angular, undefined) {
    "use strict";

    angular.module('fatoresApp.services')
        .factory('authService', authService);

    authService.$inject = ['$q', '$sanitize', 'User', 'localStorageService', 'Siglas'];
    function authService($q, $sanitize, User, localStorage, siglas) {
        'use strict';

        var _login = {
            isLogged: false,
            method: undefined
        };

        // public API
        return {
            login: loginDb,
            //logoff: logoff,
            getLoginMethod: getLoginMethod,
            isLogged: isLogged
        };


        // métodos

        // sugars
        function isLogged() {
            return _login.isLogged;
        }

        function getLoginMethod() {
            return _login.method;
        }


        /**
         * login
         * a função login se subdivide em duas partes:
         * 1. _loginDb: busca autenticar o usuário no servidor
         * 2. _loginLocal: caso _loginDb dê erro, tenta logar local
         * @param {type} loginFormData
         * @returns {undefined}
         */
        function loginDb(loginFormData) {
            var defer = $q.defer();

            loginFormData.UserName = $sanitize(loginFormData.UserName);

            var user = User.setUser(loginFormData);
            var login = User.getToken();

            login
                .then(_loginComplete, _loginLocal)
                .then(_loginComplete, _loginFailed);

            return defer.promise;

            function _loginComplete() {
                _login.isLogged = true;
                _login.method = _login.method || 'online'; 
                return defer.resolve(true);
            }
            
            function _loginFailed(err) {
                return defer.reject(err);
            }
        }

        function _loginLocal(error) {
            var customError = new Error('Usuário/Senha não conferem.');
            
            if (error.status === 500 && error.data.ExceptionMessage === "Login falhou") {
                throw customError;
            }
            
            var users = localStorage.get(siglas.usuarios);
            var compareData = User.getLoginData();
            var user = Object.keys(users).filter(function(id) {
                return users[id].UserName === compareData.UserName &&
                       users[id].Password === compareData.Password;
            });
            
            if (user.length === 1) {
                _login.method = 'local';
                User.setUser(users[user[0]]);
                return true;
            } else {
                throw customError;
            }
        }

    }
}(window.angular));
