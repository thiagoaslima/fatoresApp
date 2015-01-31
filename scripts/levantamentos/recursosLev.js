;
(function (angular, undefined) {
    'use strict';

    angular
            .module('app.levantamentos')
            .factory('RecursosLev',
                    ['$q', 'ConfigurationService', 'User', 'Entidades', 'RecursosModel',
                        RecursosLev]);

    function RecursosLev($q, Config, User, Entidades, Recurso) {
        var dadosConfig = {},
            atividadesTarefa;

        var _cache = {};

        var service = {
            open: open,
            close: close,
            send: send
        };

        init();


        /////////////////////

        function init() {
	    angular.extend(dadosConfig, Config.full());
        }

        function open(membro, atividade, hora) {
	    hora = hora.toISOString();
	    
	    var obj = {
		AtividadeTarefaId: atividadeToAtivTarefa(atividade),
		EmpresaId: dadosConfig.Empresa.Id,
		ObraId: dadosConfig.Obra.Id,
		UserId: dadosConfig.UsuarioId,
		Atividade: atividade,
		TarefaId: dadosConfig.Tarefa.Id,
		ContratadaId: dadosConfig.Contratada.Id,
		FuncaoId: membro.Funcao.Id,
		Inicio: hora,
		DataCriacao: hora,
		Colaboradores: membro.Nome,
		QuantidadeColaboradores: 1,
		Comentarios: [],
		status: 'open'
	    };
            return Recurso.new(obj);
        }
	
	function atividadeToAtivTarefa(atividade) {
	    if (_cache[atividade.Id]) {
		return _cache[atividade.Id];
	    }

	    var atividadesTarefa = Entidades.get('atividadeTarefa',
		atividade.AtividadesTarefa, true);
	    var atvTarefaId = atividade.AtividadesTarefa.filter(function (id) {
		return atividadesTarefa[id].TarefaId === dadosConfig.Tarefa.Id;
	    })[0];
	    _cache[atividade.Id] = atvTarefaId;
	    return atvTarefaId;
	}

        function close(Recurso, hora) {
            if (!Recurso) {
                return true;
            }

            var duracaoMinima = Recurso.Atividade.DuracaoMinima === 0 ?
                    30 * 1000 : Recurso.Atividade.DuracaoMinima * 1000;
            var duracaoMaxima = Recurso.Atividade.DuracaoMaxima === 0 ?
                    Number.POSITIVE_INFINITY : Recurso.Atividade.DuracaoMaxima * 1000;


            // checa se a atividade durou o tempo mínimo
            if (hora - Recurso.toDate() < duracaoMinima) {
                return Recurso.toDate();
            }

            // checa se a atividade excedeu o tempo máximo
            if (hora - Recurso.toDate() > duracaoMaxima) {
                var fim = new Date(Recurso.toDate().getTime() + duracaoMaxima * 1000);
                Recurso.close(fim);
                return newDate(fim.getTime() + 1000);
            }

            Recurso.close(hora);
            return true;
        }
	

        function send(hora) {
            var defer = $q.defer();

            var promises = {};

	    var _recursos = Recurso.all();
            _recursos.forEach(function (recurso) {
                if (recurso.isOpen()) {
                    recurso.close(hora);
                }
            });

            _recursos.forEach(function (recurso) {
                promises[recurso.Id] = recurso.post();
            });

            $q.all(promises).then(function (resp) {
                return defer.resolve(resp);
            }).catch(function (err) {
                return defer.reject(err);
            });

            return defer.promise;
        }


        ///////////////

        return service;
    }

})(window.angular);