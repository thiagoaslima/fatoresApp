;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.auth')
        .controller('Login',
            ['$scope', '$state', 'authservice', 'logger', '$http', Login]);

    function Login($scope, $state, authservice, logger, $http) {
       
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
                logger.success(
                    'Login realizado com sucesso!',
                    null,
                    'login.js: login'
                    );
                $state.go('configuracao');
            }

            // caso não, zera o formulário e avisa que os dados estão incorretos
            function loginError(err) {
                resetForm();
                logger.warn(
                    err,
                    null,
                    'login.js: login'
                    );
            }
        }

        function resetForm() {
            vm.login = vm.login || {};
            vm.login.UserName = '';
            vm.login.Password = '';
        }
    }
})(window.angular);