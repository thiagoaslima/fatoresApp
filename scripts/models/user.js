;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.models')
        .service('User', User);

    /**
     * serviço utiliza o módulo ngStorage
     */
    User.$inject = ['encryptService', 'dataservice', 'localStorageService'];
    function User(encrypt, dataservice, localStorage) {
        var model = this;
        var _user = {};

        // API
        // setter
        model.register = register;

        // getters
        model.getId = getUserId;
        model.getToken = getUserToken;
        model.getName = getUserName;
        model.getPassword = getUserPassword;
        model.getLoginData = getUserLoginData;
        model.getData = getUserData;

        // methods
        model.identify = identify;


        ///////////////////////////////////

        function register(userData) {
            angular.extend(_user, userData);
            _user.Password = userData.Password ?
                encrypt.hash(userData.Password) : '';
            return _user;
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

        function _setOnLocalStorage(user) {
            var users = localStorage[siglas.usuarios] || {};
            users[user.UserId] = user;
//            localStorage.set(siglas.usuarios, users);
        }
    }

}(window.angular));