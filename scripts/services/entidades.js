;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.services')
        .factory('Entidades', [
            '$q',
            'dataservice',
            'localStorageService',
            'hashByIdFilter',
            'unhashByIdFilter',
            'sortBrFilter',
            Entidades
        ]);

    function Entidades($q, dataservice, storage, hashById, unhashById, sortBr) {
        var _initialized = false;
        var _lista = {
            'atividade': {},
            'atividadeTarefa': {},
            'cenario': {},
            'cenarioValor': {},
            'empresa': {},
            'funcao': {},
            'obra': {},
            'tarefa': {}
        };
        var _cached = {};
        var _cachedHash = {};

        var storageEntidades = {dados: {}, datas: {}};
        var dataZero = "2014-01-01T00:00:00";

        var service = {
            init: init,
            get: get
        };

        return service;

        function init() {
            var defer = $q.defer();
            var keys = Object.keys(_lista);
            var lista = {};
            var promises = {};

            keys.forEach(function (entidade) {
                storageEntidades.dados[entidade] = storage.get(entidade) || {};
                storageEntidades.datas[entidade] = 
                    storage.get(entidade + 'Data') || dataZero;
            });

            keys.forEach(function (entidade) {
                var data = storageEntidades.datas[entidade];
                lista[entidade] = call(entidade, data);
                promises[entidade] = lista[entidade];
            });

            $q.all(promises).then(success, error).finally(retornarDados);

            function success(dados) {
                keys.forEach(function (entidade) {
                    storage.set(entidade, storageEntidades.dados[entidade]);
                    storage.set(entidade + 'Data',
                        storageEntidades.datas[entidade]);
                });
                return dados;
            }
            function error(erro) {
                keys.forEach(function (entidade) {
                    storageEntidades.dados[entidade] = storage.get(entidade) || {};
                    storageEntidades.datas[entidade] = storage.get(entidade + 'Data') || dataZero;
                });
                return storageEntidades.dados;
            }
            function retornarDados() {
                _lista = storageEntidades.dados;
                _initialized = true;

                return defer.resolve(_lista);
            }
            
            return defer.promise;


            ///////////////////////////
            
            function call(entidade, data) {
                var defer = $q.defer();
                
                dataservice.get(entidade, {data: data})
                    .then(function (resp) {
                        return updateDate(resp, entidade);
                    })
                    .then(hashById)
                    .then(function (obj) {
                        return extendLocal(obj, entidade);
                    })
                    .then(function (data) {
                        if (_cached[entidade]) {
                            delete(_cached[entidade]);
                        }

                        if (!data) {
                            defer.reject('Não há dados de ' + entidade);
                        }
                        defer.resolve(data);
                    })
                    .catch(function () {
                        defer.resolve(retrieveLocal(entidade));
                    });
                return defer.promise;
            }
        }

        function get(entidade, array, hashed) {
            if (!_initialized) {
                return init().then(function () {
                    get(entidade, array);
                });
            }

            if (!array || array.length === 0) {
                if (!_cached[entidade]) {
                    _cached[entidade] = unhashById(_lista[entidade]);
                }
                return hashed ? _lista[entidade] : _cached[entidade];
            }

            if (hashed) {
                var obj = {};
                array.forEach(function (id) {
                    obj[id] = _lista[entidade][id];
                });
                return obj;
            }

            return array.map(function (id) {
                return _lista[entidade][id];
            });
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