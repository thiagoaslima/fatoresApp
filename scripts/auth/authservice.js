;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.auth')
        .factory('authservice', [
                '$state',
                'logger', 
                'dataservice', 
                'User', 
                'localStorageService', 
                authservice]);

    function authservice($state, logger, dataservice, User, storage) {
        var _pwd = '';
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
            logger.info(
                'initialized',
                null,
                'authservice.js: init'
                );
        }

        function loginStatus() {
            return _login.status;
        }

        function loginMethod() {
            return _login.method;
        }


        function login(loginData) {
            // cria usuario com os dados passados
            _pwd = loginData.Password;
            var user = User.register(loginData);

            return logRemotelly()
                .then(proceedLogin)
                .catch(logLocally);

            ///////////////
            function logRemotelly() {
                return dataservice.requestToken(User.getName(), _pwd);
            }

            function logLocally(error) {
                // checa o erro
                // se o erro for usuario não reconhecido
                // registra a falha no login
                if (error && error.status === 500 && error.data &&
                    error.data.ExceptionMessage === 'Login falhou') {
                    return logFailed(error.data.ExceptionMessage);
                }
                // se o erro for de conexão segue com o login
                // get localStorage users
                // compara com User
                var localUsers = storage.get('users') || [];
                var validUser = localUsers.filter(function(obj) {
                    return User.identify(obj);
                });
                
                if (validUser.length > 1) {
                    var validUser = validUser.reduce(function(total, item) {
                        if (total.Expiracao > item.Expiracao) {
                            return total;
                        }
                        return item;
                    });
                    
                    localUsers = localUsers.filter(function(item) {
                        return item.Id !== validUser.Id;
                    });
                    
                }

                // caso seja bem sucedido 
                // continua o login
                if (validUser.length === 1) {
                    _login.method = 'local';
                    return proceedLogin(validUser);
                }

                // caso seja mal sucedido 
                // registra a falha no login
            }
            function proceedLogin(data) {
                _login.status = true;
                if (!_login.method) {
                    _login.method = 'server';
                }
                // atualiza e confirma usuário
                var user = User.register(data);

                // atualiza usuário no localStorage
                var localUsers = storage.get('users') || [];
                var validUser = localUsers.filter(function(vUser) {
                    return User.checkId(vUser);
                });
                
                if (validUser.length) {
                    angular.extend(validUser[0], user);
                } else {
                    if (user.UserId && 
                        localUsers.filter(function(_user) {
                            return _user.UserId === user.UserId;
                        }).length === 0
                    ) {
                        localUsers.push(user);
                    }
                }
                
                storage.set('users', localUsers);
                
                // TODO
                // inicia sessão no localstorage

                return data;
            }
            function logFailed(error) {
                logout();
                throw new Error(error);
            }

        }

        function logout() {
            _login.status = false;
            _login.method = null;
            User.reset();
            return $state.go('login');
        }
    }

})(window.angular);