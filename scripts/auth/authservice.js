;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.auth')
        .factory('authservice',
        ['logger', 'dataservice', 'User', authservice]);

        function authservice(logger, dataservice, User) {
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
                logger.info({
                    title: 'authservice.js: init',
                    msg: 'initialized'
                });
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

                    // caso seja bem sucedido 
                    // continua o login

                    // caso seja mal sucedido 
                    // registra a falha no login
                }
                function proceedLogin(data) {
                    // atualiza e confirma usuário
                    var user = User.register(data);

                    // inicia sessão  no localstorage
                    
                    return data;
                }
                function logFailed(error) {
                    throw new Error(error);
                }

            }

            function logout() {
                _login.status = false;
                _login.method = null;
            }
        }

    })(window.angular);