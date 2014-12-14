;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.auth')
        .controller('Login', ['$scope', '$state', 'authservice', 'logger', Login]);

    function Login($scope, $state, authservice, logger) {
        var vm = this;
        vm.submit = submit;
        resetForm();
        return vm;

        function submit() {
            // confere a validade dos dados
            return authservice.login(vm.login)
                .then(confirmLogin)
                .catch(loginError);

            //////////////////////
            // caso esteja ok, vai para configuração
            function confirmLogin() {
                logger.success({
                    title: 'login.js: login',
                    msg: 'Login realizado com sucesso!'
                });
                $state.go('configuracao');
            }

            // caso não, zera o formulário e avisa que os dados estão incorretos
            function loginError(err) {
                resetForm();
                logger.warn({
                    title: 'login.js: login',
                    msg: err
                });
            }
        }

        function resetForm() {
            vm.login = vm.login || {};
            vm.login.UserName = '';
            vm.login.Password = '';
        }
    }
})(window.angular);