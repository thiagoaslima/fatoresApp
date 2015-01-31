;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.services')
        .service('User', User);

    User.$inject = ['encryptService', 'dataservice', 'localStorageService'];
    function User(encrypt, dataservice, localStorage) {
        var model = this;
        var _user = {};

        // API
        // setter
        model.register = register;
        model.reset = reset;

        // getters
        model.getId = getUserId;
        model.getToken = getUserToken;
        model.getName = getUserName;
        model.getPassword = getUserPassword;
        model.getLoginData = getUserLoginData;
        model.getData = getUserData;

        // methods
        model.identify = identify;
        model.checkId = checkId;


        ///////////////////////////////////

        function register(userData) {
            if (angular.isArray(userData)) {
                userData = userData[0];
            }
            angular.extend(_user, userData);
            if (_user.Password === userData.Password) {
                _user.Password = userData.Password ?
                encrypt.hash(userData.Password) : '';
            }
            return _user;
        }
        
        function reset() {
            _user = {};
        }

        function getUserId() {
            return _user.UserId || '';
        }

        function getUserToken() {
            return _user.Token || '';
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

        function identify(dados) {
            return _user.UserName === dados.UserName &&
                _user.Password === dados.Password;
        }
        
        function checkId(dados) {
            return _user.UserId === dados.UserId;
        }
    }

}(window.angular));