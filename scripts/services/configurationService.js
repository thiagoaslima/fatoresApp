;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.models')
	.factory('ConfigurationService', ['$q', 'Entidades', 'User', Config]);

    function Config($q, Entidades, User) {
	var dados = {
	    empresa: [],
	    obra: [],
	    tarefa: []
	};

	var selected = {};

	var service = {
	    get: get,
	    full: full,
	    select: select,
	    unset: unset,
	    selected: selected
	};

	return service;

	///////////////////////

	function activate() {
	    return Entidades.init().then(function () {
		var user = User.getData();
		dados.empresa = Entidades.get('empresa', user.Empresas);
		dados.obra = Entidades.get('obra', user.Obras);
		dados.tarefa = Entidades.get('tarefa', user.Tarefas);
		return dados;
	    });
	}

	function get() {
	    var defer = $q.defer();
	    activate().then(function (dados) {
		defer.resolve(dados);
	    });
	    return defer.promise;
	}

	function _getObra() {
	    return (select('Subfracao') || select('Fracao') ||
		select('Obra') || select('Empreendimento'));
	}

	function full(justIds) {
	    var Tarefa = service.select('Tarefa');
	    
	    if (!Tarefa) {
		return {};
	    }
	    
	    if (justIds) {
		return {
		    EmpresaId: service.select('Empresa').Id,
		    ObraId: _getObra().Id,
		    UsuarioId: User.getId(),
		    TarefaId: Tarefa.Id,
		    ContratadaId: service.select('Contratada').Id
		};
	    }
	    return {
		Empresa: service.select('Empresa'),
		Obra: _getObra(),
		UsuarioId: User.getId(),
		Tarefa: Tarefa,
		Contratada: service.select('Contratada')
	    };
	}
	

	function select(entidade, obj) {
	    if (!obj) {
		return selected[entidade];
	    }

	    selected[entidade] = obj;
	    return obj;
	}

	function unset() {
	    selected = {};
	}
    }

})(window.angular);