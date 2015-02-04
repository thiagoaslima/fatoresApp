;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.layout')
	.factory('Cenario', [
	    'Entidades',
	    'ConfigurationService',
	    'Sessions',
	    'dataservice',
	    cenarioModel
	]);

    function cenarioModel(entidades, config, sessions, dataservice) {
	var service = {
	    new : create
	};

	var _cenariosValor = {};
	var _configObj = {};
	var _DataInicio = null;

	///////////////////////

	function init() {
	    var tarefa = config.select('Tarefa');
	    _cenariosValor = entidades.get('cenarioValor',
		tarefa.CenariosValor.concat(tarefa.AtributosProducao),
		true);

	    _DataInicio = sessions.current().DataInicio;
	    _configObj = config.full(true);

	    return service;
	}

	function create(obj) {
	    return new Cenario(obj);
	}

	////////////////////////////////////////////

	function Cenario(obj) {
	    this.Id = obj.Id;
	    this.Nome = obj.Nome;

	    this.CenariosValor = [];
	    this.setCenariosValor();

	    this.selectedValor = null;
	    this.OldValor = null;
	    this.selectValor(null);

	    this.Registros = [];
	    this.RegistroAtual = null;
	    this.resetRegistros();

	    return this;
	}

	Object.defineProperties(Cenario.prototype, {
	    setCenariosValor: setMethod(setCenariosValor),
	    unsetCenariosValor: setMethod(unsetCenariosValor),
	    selectValor: setMethod(selectValor),
	    unselectValor: setMethod(unselectValor),
	    setOldValor: setMethod(setOldValor),
	    checkIfIsDirty: setMethod(checkIfIsDirty),
	    pristine: setMethod(pristine),
	    openRegistro: setMethod(openRegistro),
	    closeRegistro: setMethod(closeRegistro),
	    resetRegistros: setMethod(resetRegistros),
	    update: setMethod(updateCenario),
	    reset: setMethod(resetCenario),
	    toString: setMethod(toString),
	    marker: setMethod(marker),
	    showMarker: setMethod(showMarker)
	});

	function setCenariosValor() {
	    var self = this;

	    this.CenariosValor = Object.keys(
		_cenariosValor).filter(function (id) {
		return _cenariosValor[id].CenarioId === self.Id;
	    }).map(function (id) {
		return _cenariosValor[id];
	    });

	    return this;
	}

	function unsetCenariosValor() {
	    this.CenariosValor = [];
	}



	function selectValor(obj) {
	    if (obj !== this.selectedValor) {
		this.selectedValor = obj;
	    }

	    this.checkIfIsDirty();
	    return this;
	}

	function unselectValor() {
	    this.selectValor(null);
	    return this;
	}

	function setOldValor(value) {
	    if (value === this.OldValor) {
		return;
	    }

	    this.OldValor = value;
	    return this;
	}


	function checkIfIsDirty() {
	    this.isDirty = (this.selectedValor !== this.OldValor);
	    return this;
	}

	function pristine() {
	    if (this.isDirty) {
		this.setOldValor(this.selectedValor);
	    }
	    this.isDirty = false;
	    return this;
	}


	function openRegistro(hora) {
	    if (!this.Registros || this.Registros.length === 0) {
		hora = _DataInicio;
	    }
	    this.RegistroAtual = new Registro(this.Id, hora);
	    this.Registros.push(this.RegistroAtual);
	    return this;
	}

	function closeRegistro(hora) {
	    if (this.RegistroAtual) {
		this.RegistroAtual.close(hora);
	    }
	    this.RegistroAtual = null;
	    return this;
	}

	function resetRegistros() {
	    this.Registros = [];
	    this.RegistroAtual = null;
	    return this;
	}


	function updateCenario(hora) {
	    this.closeRegistro(hora);
	    this.openRegistro(new Date(hora.getTime() + 1000));
	    this.pristine();
	    return this;
	}

	function resetCenario() {
	    this.unselectValor();
	    this.unsetCenariosValor();
	    this.resetRegistros();
	    return this;
	}


	function toString() {
	    return this.selectedValor ?
		this.Nome + ': ' + this.selectedValor.Nome : '';
	}

	function marker() {
	    return this.Nome.charAt(0).toUpperCase();
	}

	function showMarker(array, idx) {
	    if (idx === 0) {
		return true;
	    }

	    return array[idx - 1].marker() !== this.marker();
	}

	////////////////////////////////////////////

	function Registro(id, hora) {
	    this.Inicio = hora;
	    this.Fim = null;
	    this.CenarioValorId = id;
	    this.UserId = _configObj.UsuarioId;
	    this.ObraId = _configObj.ObraId;
	    this.EmpresaId = _configObj.EmpresaId;
	    this.TarefaId = _configObj.TarefaId;
	    this.DataCriacao = hora;
	    this.DataAtualizacao = hora;

	    return this;
	}

	Object.defineProperties(Registro.prototype, {
	    close: setMethod(close),
	    send: setMethod(send)
	});

	function close(hora) {
	    hora = hora.toISOString();

	    this.Fim = hora;
	    this.DataAtualizacao = hora;

	    return this;
	}

	function send(hora) {
	    hora = hora.toISOString();
	    
	    var obj = {
		"Inicio": this.Inicio,
		"Fim": hora,
		"CenarioValorId": this.CenarioValorId,
		"UserId": this.UserId,
		"ObraId": this.ObraId,
		"EmpresaId": this.EmpresaId,
		"TarefaId": this.TarefaId,
		"DataCriacao": this.DataCriacao,
		"DataAtualizacao": hora
	    };
	    
	    return dataservice.post('cenariodia', obj).then(function(resp) {
		return false;
	    }).catch(function (err) {
		return obj;
	    });

	}


	//////////////////////////////////////

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