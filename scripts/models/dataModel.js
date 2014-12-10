;
(function (angular, undefined) {
    'use strict';

    angular.module('fatoresApp.models')
        .service('DataModel', dataModel);

    dataModel.$inject = ['$q', 'DatabaseService', 'Siglas', 'localStorageService', 'User'];
    function dataModel($q, database, siglas, localStorage, User) {
        var model = this;
        var ns = siglas.database;
        var entidades = {
            'atividade': false,
            'atividadeTarefa': false,
            'cenario': false,
            'cenarioValor': false,
            'empresa': false,
            'funcao': false,
            'obra': false,
            'tarefa': false
        };

        var _pool = {};

        model.updateLocalDatabase = updateLocalDatabase;
        model.get = returnEntidade;

        return model;
        
        function returnEntidade(nome) {
            return _pool[nome];
        }

        function updateLocalDatabase() {
            var defer = $q.defer();
            var names = Object.keys(entidades);

            Object.keys(entidades).forEach(function (key) {
                _getEntidade(key).then(function (resp) {
                    entidades[key] = resp;
                    if (_testAllReady()) {

                        Object.keys(entidades).forEach(function (key) {
                            var entidade = _updateEntidadeLocal(key, entidades[key]);
                            _pool[key] = entidade;
                        });

                        return defer.resolve();
                    }
                }, function (err) {
                    return defer.reject(err);
                });
            });

            return defer.promise;
        }

        function _testAllReady() {
            return Object.keys(entidades).every(function (key) {
                return entidades[key];
            });
        }

        function _getEntidade(nome) {
            var token = User.getToken();
            var dadosLocais = localStorage.get(ns);
            var data = '2010-01-01T00:00:00.01';
            if (dadosLocais && dadosLocais.datas &&
                dadosLocais.datas[siglas[nome]]) {
                data = dadosLocais.datas[siglas[nome]];
            }
            return database.get({
                item: nome,
                token: token,
                data: data
            }).then(
                function connected(resp) {
                    return resp;
                });
        }

        function _updateEntidadeLocal(nome, array) {
            var dadosLocais = localStorage.get(
                ns) || {dados: {}, datas: {}};
            dadosLocais.dados[siglas[nome]] = dadosLocais.dados[siglas[nome]] || {};
            var entidadeLocal = dadosLocais.dados[siglas[nome]];
            var dataAtualizacao = dadosLocais.datas[siglas[nome]] || '';

            array.forEach(function (obj) {
                if (entidadeLocal[obj.Id]) {
                    angular.extend(entidadeLocal[obj.Id], obj);
                } else {
                    entidadeLocal[obj.Id] = obj;
                }
                if (dataAtualizacao < obj.DataAtualizacao) {
                    dataAtualizacao = obj.DataAtualizacao;
                }
            });

            dadosLocais.datas[siglas[nome]] = dataAtualizacao;
            localStorage.set(ns, dadosLocais);
            
            return entidadeLocal;
        }

    }
}(window.angular));