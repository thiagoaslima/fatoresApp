;
(function (angular) {
    'use strict';

    angular.module('app.layout')
	.factory('cenariosService', [
	    '$q',
	    'Entidades',
	    'ConfigurationService',
	    'Sessions',
	    'Cenario',
	    'sortBrFilter',
	    'safellyRemoveFilter',
	    cenariosService
	]);

    function cenariosService($q, entidades, config, sessions, Cenario, sort,
	safellyRemove) {

	var _cenarios = {};
	var _DataInicio = null;
	var _cachedAllArray = [];
	var _configObj = null;

	var service = {
	    all: all,
	    reset: reset,
	    send: send
	};

	/////////////////////////////////////////

	function init() {
	    var tarefa = config.select('Tarefa');
	    var _cenariosValor = entidades.get('cenarioValor',
		tarefa.CenariosValor, true);
	    var cenariosId = Object.keys(_cenariosValor).map(function (id) {
		return _cenariosValor[id].CenarioId;
	    }).filter(function (el, idx, array) {
		return array.indexOf(el) === idx;
	    });

	    entidades.get('cenario', cenariosId).map(function (cenario) {
		return Cenario.new(cenario);
	    }).forEach(function (cenario) {
		_cenarios[cenario.Id] = cenario;
	    });

	    return service;
	}


	function all() {
	    if (_cachedAllArray.length === 0) {
		_cachedAllArray = Object.keys(_cenarios).map(function (id) {
		    return _cenarios[id];
		});
		_cachedAllArray = sort(_cachedAllArray, 'Nome');
	    }

	    return _cachedAllArray;
	}

	function reset() {
	    Object.keys(_cenarios).forEach(function (id) {
		_cenarios[id].reset();
	    });
	    _cenarios = {};

	    return _cenarios;
	}

	function send(hora) {
	    var defer = $q.defer();

	    var promises = {};
	    Object.keys(_cenarios).forEach(function (id) {
		var cenarios = _cenarios[id].Registros;
		promises[id] = [];

		cenarios.forEach(function (cenario) {
		    promises[id].push(cenario.send(hora));
		});
	    });


	    $q.all(promises).then(function (resp) {
		resp = Object.keys(resp).map(function (id) {
		    return resp[id].filter(function (val) {
			return !!val;
		    });;
		});
		
		defer.resolve(resp);
	    });

	    return defer.promise;
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