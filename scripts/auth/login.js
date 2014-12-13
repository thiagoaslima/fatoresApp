;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.auth')
        .controller('Login', ['$scope', 'common', 'authService', Login]);

    function Login($scope, common, authService) {
        var vm = this;
        vm.submit = submit;

        resetForm();

        return vm;

        function submit() {
            // confere a validade dos dados
            authService.login().then(
                // caso esteja ok, vai para configuração
                    function success() {
                        common.routes.to('configuracao');
                    },
                    // caso não, zera o formulário e avisa que os dados estão incorretos
                        function fail() {
                            resetForm();
                        }
                    );
                }

            function resetForm() {
                vm.login = vm.login || {};
                vm.login.UserName = '';
                vm.login.Password = '';
            }


        }

})(window.angular);