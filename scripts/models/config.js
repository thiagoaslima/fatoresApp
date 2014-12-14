;
(function (angular, undefined) {
    'use strict';

    angular
            .module('app.models')
            .factory('Config', ['$q', 'Entidades', 'User', Config]);

    function Config($q, Entidades, User) {
        var dados = {
            empresa: [],
            obra: [],
            tarefa: []
        };
        var service = {
            get: get
        };

        activate();

        return service;

        ///////////////////////

        function activate() {
            Entidades.init().then(function () {
                var user = User.getData();
                dados.empresa = Entidades.get('empresa', user.Empresas);
                dados.obra = Entidades.get('obra', user.Obras);
                dados.tarefa = Entidades.get('tarefa', user.Tarefas);
            });
        }
        
        function get() {
            return dados;
        }
    }

})(window.angular);