;
(function (angular, undefined) {
    'use strict';

    angular.module('app.layout')
	.controller('atividadesController',
	    ['$state', 'filterFilter', 'sortBrFilter', 'Equipe', 'AtividadesService', 'Levantamentos', ativCtrl]);

    function ativCtrl($state, filter, sort, Equipe, Atividades, Levantamentos) {
	var vm = this;
	var hora = new Date();

	angular.extend(vm, {
	    Atividades: Atividades.gerais(),
	    Equipe: Equipe.all(),
	    selected: {
		Atividade: [],
		Equipe: Equipe.getSelecionados()
	    },
	    selecao: [],
	    
            //// methods
	    select: select,
	    toggle: toggle,
	    reset: reset,
	    registrar: registrar,
	    rebuildLevel: rebuildLevel
	});

	init();

	return vm;


	//////////////////////////////////////////

	function init() {
	    vm.selecao = sort(vm.Atividades, 'Nome');
	    return vm;
	}

	function toggle(evt, membro) {
	    if (evt.target.tagName.toLowerCase() === 'label') {
		evt.preventDefault();
	    }
	    if (evt.target.tagName.toLowerCase() === 'input') {
		return;
	    }
	    
	    
	    if (membro.isSelected) {
		return Equipe.deselect(membro);
	    }
	    return Equipe.select(membro);
	}

	function select(evt, atividade) {
	    if (evt.target.tagName.toLowerCase() === 'input') {
		return;
	    }
	    
	    if (atividade.AtividadesFilhas.length) {
		evt.stopPropagation();
		vm.selecao = atividade.AtividadesFilhas;
		vm.selected.Atividade.push(atividade);
		return true;
	    }

	    vm.selecao = [];
	    vm.selected.Atividade.push(atividade);
	    return true;
	}

	function reset() {
	    Equipe.deselectAll();
	    vm.selected.Atividade = [];
	    return true;
	}

	function registrar() {
	    var atividade = vm.selected.Atividade.pop();

	    // ignora membro caso ele esteja continuando a mesma atividade
	    // e tenha sido selecionado
	    vm.selected.Equipe.filter(function (membro) {
		return membro.Atividade === atividade;
	    }).forEach(function (membro) {
		Equipe.deselect(membro);
	    });


	    Levantamentos.recursos.registrar(vm.selected.Equipe, atividade,
		hora);
	    Equipe.setAtividade(vm.selected.Equipe, atividade);

	    reset();
	}

	function rebuildLevel(atividade) {
	    vm.selected.Atividade.length = vm.selected.Atividade.indexOf(atividade);

	    if (atividade.AtividadePaiId === null) {
		return init();
	    }

	    vm.selecao = sort(vm.atividades.delegaveis.filter(function (atv) {
		    return atv.AtividadePaiId === atividade.AtividadePaiId;
		}), 'Nome');

	    return vm;
	}

    }

})(window.angular);