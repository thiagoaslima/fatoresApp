;
(function (angular, undefined) {
    'use strict';

    angular.module('app.services')
	.factory('AtividadesService',
	    ['Entidades', 'ConfigurationService', 'hashByIdFilter', 'removeDuplicatesFilter', atividades]);

    function atividades(Entidades, Config, hashById, removeDuplicates) {

	var _aguardando = {
	    "Nome": "Aguardando atividade",
	    "Id": -1,
	    "Membros": [],
	    "AtividadePaiId": null,
	    "Cor": "#B0B0BB",
	    "DuracaoMinima": 0,
	    "DuracaoMaxima": 0,
	    "Status": true,
	    "AtividadesFilhas": [],
	    "AtividadesTarefa": []
	};

	var service = {
	    all: all,
	    delegaveis: delegaveis,
	    gerais: gerais,
	    aguardando: _aguardando
	};

	var _atividades = [];
	var _delegaveis = [];
	var _gerais = [];

	init();

	//////////

	function init() {

	    var tarefa = Config.select('Tarefa');
	    var array = removeDuplicates(tarefa.Atividades);

	    // busca na memória as atividades registradas na tarefa
	    var atividades = Entidades.get('atividade', array);
	    var hashed = Entidades.get('atividade', array, true);

	    atividades.forEach(function (atividade) {
		atividade.Nome = formatAsTitle(atividade.Nome);
		atividade.AtividadesFilhas.map(function (id) {
		    return hashed[id];
		}).filter(function (obj) {
		    return obj;
		}).forEach(getAtividadeTarefaId);
	    });

	    // a tarefa não está apontando atividades de primeiro nível,
	    // portanto itera para achá-las
	    var nivel1 = removeDuplicates(atividades.map(function (at) {
		return at.AtividadePaiId;
	    }));

	    // busca essas atividades de 1° nivel na memória
	    nivel1 = Entidades.get('atividade', nivel1).map(function (ativ) {
		ativ.Nome = formatAsTitle(ativ.Nome);
		return ativ;
	    });

	    // substitui em atividades filhas, as Ids pelo objeto recursivamente
	    nivel1.forEach(function (ativ) {
		ativ.AtividadesFilhas = ativ.AtividadesFilhas.map(function (id) {
		    return hashed[id];
		}).filter(function (ativ) {
		    return ativ;
		});
	    });

	    _atividades = [_aguardando].concat(nivel1).concat(atividades);

	    _delegaveis = _atividades.filter(function (ativ) {
		return ativ.AtividadesFilhas.length === 0;
	    });
	    _gerais = _atividades.filter(function (ativ) {
		return ativ.AtividadePaiId === null;
	    });

	    return true;

	}

	function getAtividadeTarefaId(atividade) {
	    // só executa a ação para as atividades delegáveis,
	    // ou seja, as de último nível, que não possuem AtividadesFilhas
	    if (atividade.AtividadesFilhas.length === 0) {
		// grava qual a AtividadeTarefa correspondente
		var atividadesTarefa = Entidades.get('atividadeTarefa',
		    atividade.AtividadesTarefa, true);
		atividade.AtividadeTarefaId = atividade.AtividadesTarefa.filter(
		    function (id) {
			return atividadesTarefa[id].TarefaId === tarefa.Id;
		    })[0];
	    }
	    return atividade;
	}

	function formatAsTitle(str) {
	    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
	}


	function all() {
	    return _atividades;
	}
	function delegaveis() {
	    return _delegaveis;
	}
	function gerais() {
	    return _gerais;
	}


	////////////

	return service;
    }

})(window.angular);