;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.services')
	.factory('Equipe', ['Membros', 'AtividadesService', 'sortBrFilter', 'safellyRemoveFilter', Equipe]);

    function Equipe(Membros, Atividades, sort, safellyRemove) {

	var service = {
	    add: add,
	    remove: remove,
	    all: all,
	    
	    select: select,
	    deselect: deselect,
	    deselectAll: deselectAll,
	    getSelecionados: getSelecionados,
	    
	    setAtividade: setAtividade,
	    aguardando: aguardando,
            reset: reset
	};

	var atividadeBase = Atividades.aguardando;
	var _equipe = [];
	var _selecionados = [];

	/////////////////////

	function all() {
	    return _equipe;
	}
	
	function add(obj) {
	    obj.Atividade = atividadeBase;
	    _equipe.push(Membros.new(obj));
	    _equipe = sort(_equipe, 'Nome');
	    return _equipe;
	}

	function remove(membro) {
	    safellyRemove(_equipe, membro);
	    membro.delete();
	    return _equipe;
	}



	function getSelecionados() {
	    return _selecionados;
	}
	
	function select(membros) {
	    membros = angular.isArray(membros) ? membros : [membros];
	    
	    membros.forEach(function(membro){
		_selecionados.push(membro.select());
	    });
	    
	    return _selecionados;
	}
	
	function deselect(membros) {
	    membros = angular.isArray(membros) ? membros : [membros];
	    
	    membros.forEach(function(membro){
		safellyRemove(_selecionados, membro.deselect());
	    });
	    
	    return _selecionados;
	}
	
	function deselectAll() {
	    _selecionados.forEach(function(membro) {
		membro.deselect();
	    });
	    _selecionados = [];
	    return _selecionados;
	}
	
	
	
	function setAtividade(membros, atividade) {
	    membros = angular.isArray(membros) ? membros : [membros];
	    
	    membros.forEach(function(membro){
		membro.changeAtividade(atividade);
	    });
	    
	    return _selecionados;
	}
	
	function aguardando() {
	    _equipe.forEach(function(membro) {
		membro.changeAtividade(atividadeBase);
		membro.unsetRecurso();
	    });
	}
        
        function reset() {
//            service.aguardando();
            var len = _equipe.length - 1;
            for (; len >= 0; len--) {
               _equipe[len].delete();
            }
            
            _equipe = [];
            _selecionados = [];
            return _equipe;
        }

	///////////////////////

	return service;
    }

})(window.angular);