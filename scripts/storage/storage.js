;
(function (angular, undefined) {
    'use strict';

    angular
            .module('app.storage')
            .factory('Storage', ['localStorageService', storage]);

    function storage(localstorage) {
        var _cache = {};
        
        var process = {
            cenario: cenario
        }

        return {
            get: get,
            set: set
        };

        function get(entidade) {
            if (_cache[entidade]) {
                return _cache[entidade];
            }

            var data = localstorage.get(entidade);
            return typeof process[entidade] === 'function' ?
                process[entidade](data) : data;
        }

        function set(entidade, data) {
            _cache[entidade] = data;
            var info = typeof process[entidade] === 'function' ?
                process[entidade](data) : data;
            localstorage.set(entidade, info);
            return info;
        }

        function atividade(data) {
            var props = ["Id", "AtividadePaiId", "Nome", "Cor", "DuracaoMinima", "DuracaoMaxima", "Status", "DataAtualizacao", "AtividadesFilhas", "AtividadesTarefa"];
        }
        
        function atividadeTarefa(data) {
            var props = ["Id", "AtividadeId", "Atividade", "TarefaId", "Tarefa", "UserId", "Usuario", "ParticipaQS", "PercentualQS", "PercentualQS2", "PercentualQS3", "DataCriacao", "DataAtualizacao", "Status", "Levantamentos"]
        }

       function cenario(data) {
           var props = ["Id", "Nome", "Descricao", "Obrigatorio", "UserId", "Usuario", "DataCriacao", "DataAtualizacao", "Status", "Valores"];
           
           /// modo descompact
           if (angular.isArray(data)) {
               
           }
           
           var info = [];
           Object.keys(data).forEach(function(key) {
              var obj = data[key];
              var array = [];
              Object.keys(obj).forEach(function(key) {
                  var idx = props.indexOf(key);
                  array[idx] = obj[key];
              });
              info.push(array);
           });
           
           return info;
       }
       
       function tarefa(data) {
           var props = ["Id", "Nome", "Descricao", "Peso", "Status", "DataCriacao", "DataAtualizacao", "UserId", "Usuario", "Tarefas", "TarefasInativas", "Levantamentos"]
       }
    }

})(window.angular);