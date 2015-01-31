;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.layout')
	.controller('Configuracao', [
	    '$scope',
	    'filterFilter',
	    'sortBrFilter',
	    'dados',
	    'ConfigurationService',
	    'session',
	    Configuracao
	]);

    function Configuracao($scope, filter, sort, dados, Config, session) {

	var vm = this;
	var idEmpresas = dados.obra.map(function (obra) {
	    return obra.EmpresaId;
	});

	var getEntidadeFilha = {
	    empresa: empresa,
	    empreendimento: empreendimento,
	    obra: obra,
	    fracao: fracao,
	    subfracao: subfracao,
	    contratada: contratada,
	    tarefa: tarefa
	};

	var _optionsObrasIsOpen = false;

	angular.extend(vm, {
	    buttons: {
		ok: {
		    disabled: true
		}
	    },
	    selected: {},
	    select: select,
	    selectObra: selectObra,
	    rebuildLevel: rebuildLevel,
	    isSelected: isSelected,
	    Empresas: [],
	    Empreendimentos: [],
	    Obras: [],
	    Fracoes: [],
	    Subfracoes: [],
	    Contratadas: [],
	    Tarefas: []
	});

	init();


	////////////////////

	function init() {
	    vm.Empresas = checkIds(dados.empresa, idEmpresas);
	    sort(vm.Empresas, 'RazaoSocial');
	    if (vm.Empresas.length === 1) {
		vm.select(null, 'Empresa', vm.Empresas[0]);
	    }
	}

	function checkIds(itens, array) {
	    if (!array) {
		return [];
	    }

	    return itens.filter(function (item) {
		return array.indexOf(item.Id) > -1;
	    });
	}

	function select(evt, entidade, obj) {
	    if (evt && evt.target && evt.target.tagName.toLowerCase() === 'input') {
		return;
	    }

	    vm.buttons.ok.disabled = true;

	    if (angular.equals(vm.selected[entidade], obj)) {
		return;
	    }

	    vm.selected[entidade] = obj;
	    var result = update(entidade, obj);

	    if (result.array && result.array.length === 1) {
		vm.select(null, result.filha, result.array[0]);
	    }

	    return result.array;
	}

	function selectObra(evt, obra) {
	    if (evt && evt.target && evt.target.tagName.toLowerCase() === 'input') {
		return;
	    }
	    _optionsObrasIsOpen = true;

	    vm.buttons.ok.disabled = true;

	    var obrasFilhas = filter(dados.obra, {ObraId: obra.Id});

	    vm.selected.obras = vm.selected.obras || [];
	    var idx;
	    vm.selected.obras.forEach(function (item, i) {
		if (item.ObraId === obra.ObraId) {
		    idx = i;
		}
	    });
	    if (typeof idx !== 'undefined') {
		vm.selected.obras.length = idx;
	    }
	    vm.selected.obras.push(obra);

	    switch (vm.selected.obras.length) {
		case 1:
		    vm.selected.Empreendimento = obra;
		    unset('Obra');
		    unset('Fracao', 'Fracoes');
		    unset('Subfracao', 'Subfracoes');
		    unset('Contratada');
		    unset('Tarefa');
		    break;

		case 2:
		    vm.selected.Obra = obra;
		    unset('Fracao', 'Fracoes');
		    unset('Subfracao', 'Subfracoes');
		    unset('Contratada');
		    unset('Tarefa');
		    break;

		case 3:
		    vm.selected.Fracao = obra;
		    unset('Subfracao', 'Subfracoes');
		    unset('Contratada');
		    unset('Tarefa');
		    break;

		case 4:
		    vm.selected.Subfracao = obra;
		    unset('Contratada');
		    unset('Tarefa');
		    break;
	    }

	    vm.Obras = sort(obrasFilhas, 'Nome');

	    if (obrasFilhas.length === 1) {
		evt && evt.stopPropagation();
		return selectObra(null, obrasFilhas[0]);
	    }

	    if (obrasFilhas.length) {
		evt && evt.stopPropagation();
		return vm.Obras;
	    }

	    // não há obras filhas
	    vm.Contratadas = checkIds(dados.empresa, obra.Contratadas);
	    vm.Contratadas = sort(vm.Contratadas, 'RazaoSocial');

	    if (vm.Contratadas.length === 1) {
		select(null, 'Contratada', vm.Contratadas[0]);
	    }
	    _optionsObrasIsOpen = false;
	    return true;
	}

	function rebuildLevel(evt, obra) {
	    if (!obra) {
		return vm;
	    }

	    if (_optionsObrasIsOpen) {
		evt.stopPropagation();
	    }

	    vm.Obras = sort(dados.obra.filter(function (item) {
		return item.ObraId === obra.ObraId;
	    }), 'Nome');
	    return vm;
	}

	function isSelected(obj, model) {
	    return obj && model && obj === model;
	}

	function update(entidade, obj) {
	    return getEntidadeFilha[entidade.toLowerCase()](obj);

	}


	////////////////////////////

	function empresa(obj) {
	    unset('Empreendimento');
	    unset('Obra');
	    unset('Fracao', 'Fracoes');
	    unset('Subfracao', 'Subfracoes');
	    unset('Contratada');
	    unset('Tarefa');

	    vm.Obras = checkIds(dados.obra,
		obj.Obras).filter(function (obra) {
		return obra.ObraId === null;
	    });
	    sort(vm.Obras, 'Nome');

	    return {
		array: vm.Obras,
		filha: 'Obra'
	    };
	}

	function empreendimento(obj) {
	    unset('Obra');
	    unset('Fracao', 'Fracoes');
	    unset('Subfracao', 'Subfracoes');
	    unset('Contratada');
	    unset('Tarefa');

	    vm.Obras = filter(dados.obra, {ObraId: obj.Id});
	    sort(vm.Obras, 'Nome');

	    if (!vm.Obras.length) {
		vm.Contratadas = checkIds(dados.empresa,
		    vm.selected.Empreendimento.Contratadas);
		sort(vm.Contratadas, 'RazaoSocial');
		return {
		    array: vm.Contratadas,
		    filha: 'Contratada'
		};
	    }
	    return {
		array: vm.Obras,
		filha: 'Fracao'
	    };
	}

	function obra(obj) {
	    unset('Fracao', 'Fracoes');
	    unset('Subfracao', 'Subfracoes');
	    unset('Contratada');
	    unset('Tarefa');

	    vm.Fracoes = filter(dados.obra, {ObraId: obj.Id});
	    sort(vm.Fracoes, 'Nome');

	    if (!vm.Fracoes.length) {
		vm.Contratadas = checkIds(dados.empresa,
		    vm.selected.Obra.Contratadas);
		sort(vm.Contratadas, 'RazaoSocial');
		return {
		    array: vm.Contratadas,
		    filha: 'Contratada'
		};
	    }
	    return {
		array: vm.Fracoes,
		filha: 'Subfracao'
	    };
	}

	function fracao(obj) {
	    unset('Subfracao', 'Subfracoes');
	    unset('Contratada');
	    unset('Tarefa');

	    vm.Subfracoes = filter(dados.obra, {ObraId: obj.Id});
	    sort(vm.Subfracoes, 'Nome');

	    if (!vm.Subfracoes.length) {
		vm.Contratadas = checkIds(dados.empresa,
		    vm.selected.Obra.Contratadas);
		sort(vm.Contratadas, 'RazaoSocial');
		return {
		    array: vm.Contratadas,
		    filha: 'Contratada'
		};
	    }
	    return {
		array: vm.Subfracoes,
		filha: 'Contratada'
	    };
	}

	function subfracao(obj) {
	    unset('Contratada');
	    unset('Tarefa');

	    vm.Contratadas = checkIds(dados.empresa,
		vm.selected.Obra.Contratadas);
	    sort(vm.Contratadas, 'RazaoSocial');

	    return {
		array: vm.Contratadas,
		filha: 'Contratada'
	    };
	}

	function contratada(obj) {
	    unset('Tarefa');

	    vm.Tarefas = checkIds(dados.tarefa,
		vm.selected.Contratada.Tarefas);
	    sort(vm.Tarefas, 'Nome');

	    return {
		array: vm.Tarefas,
		filha: 'Tarefa'
	    };
	}

	function tarefa(obj) {
	    vm.buttons.ok.disabled = false;

	    Object.keys(vm.selected).forEach(function (key) {
		Config.select(key, vm.selected[key]);
	    });
	    session.saveConfig(Config.full(true));

	    return {
		array: [],
		filha: ''
	    };
	}

	function unset(entidade, plural) {
	    if (entidade === 'Tarefa' && vm.selected.Tarefa) {
		Config.unset();
		session.saveConfig(Config.full(true));
	    }

	    if (!plural) {
		plural = entidade + 's';
	    }

	    return vm[plural] = [] & delete(vm.selected[entidade]);
	}
    }

})(window.angular);