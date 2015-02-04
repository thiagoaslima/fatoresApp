;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.layout')
	.controller('producaoController', [
	    '$state',
	    'producaoService',
	    producaoCtrl
	]);

    function producaoCtrl($state, producao) {
	var vm = this;

	angular.extend(vm, {
	    produtos: producao.Produtos.all(),
	    
	    atualizar: atualizar,
	    edit: edit
	});

	//////////////////////////////

	function atualizar(evt, produto) {
	    return $state.go('produto', {id: produto.Id});
	}

	function edit(evt, produto) {
	    evt.stopPropagation();
	    return $state.go('produtoEdit', {id: produto.Id});
	}

	//////////////////////////////

	return vm;
    }
})(window.angular);