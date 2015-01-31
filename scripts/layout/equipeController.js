(function (angular, undefined) {
    'use strict';

    angular.module('app.layout')
	.controller('equipeController',
	    ['funcoes', 'sortBrFilter', 'Equipe', 'safellyRemoveFilter', equipeController]);

    function equipeController(funcoes, sort, Equipe, safellyRemove) {
	var vm = this;

	vm.funcoes = funcoes;
	vm.trabalhadores = Equipe.all();
	vm.nomes = []; 
	updateNomes();

	angular.extend(vm, {
	    formulario: formulario,
	    adicionar: adicionar,
	    remover: remover,
	    cancelar: reset,
	    showExp: showExp,
	    updateNomes: updateNomes
	});

	reset();

	return vm;

	////////////////

	function formulario(funcao) {
	    vm.showForm = true;
	    vm.trabalhador.Funcao = funcao;
	    vm.trabalhador.Nome = funcao.Nome + ' ' + (funcao.Membros ? funcao.Membros.length + 1 : 1);
	    return true;
	}

	function adicionar() {
	    var trabalhador = {
		Nome: vm.trabalhador.Nome,
		Funcao: vm.trabalhador.Funcao,
		Experiencia: vm.trabalhador.experiencia.tempo
	    };

	    Equipe.add(trabalhador);
	    vm.updateNomes();
	    reset();

	    return trabalhador;
	}

	function remover(membro) {
	    Equipe.remove(membro);
	    safellyRemove(vm.nomes, membro.Nome);
	    vm.updateNomes();
	    return true;
	}

	function reset() {
	    vm.showForm = false;
	    vm.trabalhador = {
		Nome: "",
		experiencia: {
		    tempo: '',
		    unidade: 'anos'
		},
		Funcao: ""
	    };
	    return true;
	}

	function showExp(tempo) {
	    tempo = parseInt(tempo, 10) * 12;
	    var anos = Math.floor(tempo / 12);
	    var meses = tempo % 12;

	    var div = anos || meses ? " • " : "";
	    var txtAnos = anos ? (anos + (anos > 1 ? ' anos' : ' ano')) : "";
	    var div2 = anos && meses ? " e " : " ";
	    var txtMeses = meses ? (meses + (meses > 1 ? ' meses' : ' mês')) : "";

	    return div + txtAnos + div2 + txtMeses;
	}

	function updateNomes() {
	    vm.nomes = vm.trabalhadores.map(function (membro) {
		return membro.Nome;
	    });
	    return vm.nomes;
	}

    }

}(window.angular));