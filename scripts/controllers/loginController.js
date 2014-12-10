;
(function (angular) {
    'use strict';

    angular
        .module('fatoresApp.controllers')
        .controller('loginController', loginController);

    loginController.$inject = ['$rootScope', '$scope', '$location', 'authService', 'DataModel'];
    function loginController($rootScope, $scope, $location, auth, dataModel) {
        var ctrl = this;

        $scope.login = {
            UserName: '',
            Password: ''
        };
        
        $rootScope.loading = {
            status:false
        };

        ctrl.submit = function submit() {
            var login = auth.login($scope.login);
            $scope.loading.status = true;

            login.then(function success() {
                dataModel.updateLocalDatabase().then(function() {
                    $rootScope.loading.status = false;
                    $location.path('configuracao');
                });
            }, function fail(err) {
                $rootScope.loading.status = false;
                $scope.login.UserName = '';
                $scope.login.Password = '';
            });
        };
    }

}(window.angular)
    );