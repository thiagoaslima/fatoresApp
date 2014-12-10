;
(function (angular, undefined) {
    'use strict';

    angular
        .module('fatoresApp.models')
        .service('User', userModel);

    /**
     * serviço utiliza o módulo ngStorage
     */
    userModel.$inject = ['EncryptService', 'DatabaseService', 'localStorageService', 'Siglas'];
    function userModel(encrypt, database, localStorage, siglas) {
        var model = this;
        var _user = {};
        var _pwd = '';

        // API
        // setter
        model.setUser = setUser;

        // getters
        model.getId = getUserId;
        model.getToken = getUserToken;
        model.getName = getUserName;
        model.getPassword = getUserPassword;
        model.getLoginData = getUserLoginData;
        model.getData = getUserData;

        function setUser(userData) {
            angular.extend(_user, userData);
            _user.Password = userData.Password ?
                _hashPassword(userData.Password) : _hashPassword(_pwd);
            return _user;
        }

        function _hashPassword(pwd) {
            _pwd = pwd;
            return pwd ? encrypt.hash(pwd) : '';
        }

        function getUserId() {
            return _user.UserId || '';
        }

        function getUserToken() {
            var isTokenValid = _checkTokenValidity();
            if (isTokenValid) {
                return _user.Token;
            } else {
                return _retrieveToken().then(
                    function success(resp) {
                        var user = setUser(resp);
                        _setOnLocalStorage(user);
                        return _user.Token;
                    },
                    function fail(err) {
                        throw err;
                    }
                );
            }
        }

        function _retrieveToken() {
            return database.get({
                item: 'token',
                username: _user.UserName,
                password: _pwd
            });
        }

        function _checkTokenValidity() {
            if (!_user || !_user.Expiracao) {
                return false;
            }

            var now = new Date();
            // expiracao é sempre no tempo GMT+0
            // mas ao passar em new Date() é convertido para o horário local
            var expiracao = new Date(_user.Expiracao);

            // testa se o token é válido por 2 minutos (em milissegundos)
            return expiracao - now > 2 * 60 * 1000;
        }

        function getUserName() {
            return _user.UserName || '';
        }

        function getUserPassword() {
            return _user.Password || '';
        }

        function getUserLoginData() {
            return {
                UserName: getUserName(),
                Password: getUserPassword()
            };
        }

        function getUserData() {
            return {
                Empresas: _user.Empresas,
                Obras: _user.Obras,
                Tarefas: _user.Tarefas
            };
        }
        
        function _setOnLocalStorage(user) {
            var users = localStorage[siglas.usuarios] || {};
            users[user.UserId] = user;
            localStorage.set(siglas.usuarios, users);
        }
    }

}(window.angular));