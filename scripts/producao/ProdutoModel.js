;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.layout')
	.factory('ProdutoModel', [
	    'Entidades',
	    'ConfigurationService',
	    'Sessions',
	    'Cenario',
	    'dataservice',
	    produtoModel
	]);

    function produtoModel(entidades, config, sessions, Cenario, dataservice) {
	var service = {
	    new : create
	};

	var _id = 0,
	    _atributosValor = [],
	    _atributos = [],
	    _configObj = {},
	    _DataInicio = null
	    ;


	//////////////////////////

	function init() {
	    var tarefa = config.select('Tarefa');

	    _atributosValor = entidades.get('cenarioValor',
		tarefa.AtributosProducao, true);

	    var cenariosId = Object.keys(_atributosValor).map(function (id) {
		return _atributosValor[id].CenarioId;
	    }).filter(function (el, idx, array) {
		return array.indexOf(el) === idx;
	    });

	    _atributos = entidades.get('cenario', cenariosId).map(
		function (cenario) {
		    return Cenario.new(cenario);
		});


	    _configObj = config.full(true);
	    _DataInicio = sessions.current().DataInicio;

	    return service;
	}

	function create(obj) {
	    return new Produto(obj);
	}

	//////////////////////////////

	function Produto(obj) {
	    this.Id = ++_id;
	    this.Identificadores = obj.Identificadores;
	    this.Atributos = [];
	    this.Medicao = [];

	    this.setAtributos(obj.Atributos);
	    this.setMedicao(obj.Medicao);

	    return this;
	}

	Object.defineProperties(Produto.prototype, {
	    setAtributos: setMethod(setAtributos),
	    sendAtributos: setMethod(sendAtributos),
	    setMedicao: setMethod(setMedicao),
	    send: setMethod(send)
	});


	function setAtributos(arr) {
	    this.Atributos = angular.copy(arr) || [];
	}

	function sendAtributos() {
	    return this.Atributos.filter(function (attr) {
		return attr.selectedValor || attr.selectedValor === 0;
	    }).map(function (attr) {
		return attr.selectedValor.Id;
	    });
	}

	function setMedicao(arr) {
	    this.Medicao = angular.copy(arr) || [];
	}

	function send(hora) {
	    hora = hora.toISOString();
	    var attr = this.sendAtributos();

	    var obj = {
		QS1: attr[0] || 0,
		QS2: attr[1] || 0,
		QS3: attr[2] || 0,
		ObraId: _configObj.ObraId,
		TarefaId: _configObj.TarefaId,
		EmpresaId: _configObj.ContratadaId,
		UserId: _configObj.UsuarioId,
		Inicio: _DataInicio,
		DataCriacao: _DataInicio,
		Fim: hora,
		DataAtualizacao: hora
	    };
	    
	    return dataservice.post('producao', obj).then(function(resp) {
		return false;
	    }).catch(function (err) {
		return obj;
	    });
	}

	//////////////////////////////

	function setMethod(fn, enumerable) {
	    return {
		value: fn,
		enumerable: !!enumerable
	    };
	}

	init();

	return service;
    }

})(window.angular);