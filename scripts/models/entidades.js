;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.models')
        .factory('Entidades', [
            '$q',
            'dataservice',
            'storage',
            'hashByIdFilter',
            Entidades
        ]);

    function Entidades($q, dataservice, storage, hashById) {
        var _lista = {
            'atividade': [],
            'atividadeTarefa': [],
            'cenario': [],
            'cenarioValor': [],
            'empresa': [],
            'funcao': [],
            'obra': [],
            'tarefa': []
        };
        var storageEntidades = storage.get('database') || {dados: {}, datas: {}};
        var dataZero = "2014-01-01T00:00:00";
        var service = {
            init: init,
            get: get
        };

        return service;

        function init() {
            var defer = $q.defer();
            var keys = Object.keys(_lista);

            keys.forEach(function (entidade) {
                var data = storageEntidades.datas ?
                    storageEntidades.datas[entidade] : dataZero;
                _lista[entidade] = call(entidade, data);
            });
            function call(entidade, data) {
                var defer = $q.defer();
                dataservice.get(entidade, {data: data})
                    .then(function(resp){ return updateDate(resp, entidade); })
                    .then(hashById)
                    .then(function(obj) { return extendLocal(obj, entidade); })
//                    .catch(retrieveLocal)
                    .then(function (data) {
                        if (!data) {
                            defer.reject('Não há dados de ' + entidade);
                        }
                        defer.resolve(data);
                    });
                return defer.promise;
            }

            $q.all([
                _lista.atividade,
                _lista.atividadeTarefa,
                _lista.cenario,
                _lista.cenarioValor,
                _lista.empresa,
                _lista.funcao,
                _lista.obra,
                _lista.tarefa
            ]).then(function (dados) {
                console.log(dados);
                storage.set('database', storageEntidades);
                defer.resolve();
            });

            return defer.promise;
        }

        function get() {
        }

        function extendLocal(obj, entidade) {
            var local = retrieveLocal(entidade) || {};
            var dados = (Object.keys(obj).length === 0) ?
                local : angular.extend(local, obj);
            storageEntidades.dados[entidade] = dados;
            return dados;
        }

        function updateDate(array, entidade) {
            var data = storageEntidades.datas[entidade] || dataZero;
            array.forEach(function (el) {
                if (el.DataAtualizacao > data) {
                    data = el.DataAtualizacao;
                }
            });
            storageEntidades.datas[entidade] = data;
            return array;
        }

        function retrieveLocal(nome) {
            return storageEntidades.dados[nome];
        }
    }

})(window.angular);