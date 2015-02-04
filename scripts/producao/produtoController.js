;(function (angular, undefined) {
	'use strict';
	
	angular
		.module('app.layout')
		.controller('produtoController', [
			'Produto',
			'ProdutoModel',
			'producaoService',
			produtoController
		]);
		
	function produtoController(produto, model, producaoSrv) {
		var vm = this;
		
		angular.extend(vm, {
			Nomes: producaoSrv.Nomes.all(),	
			Atributos: producaoSrv.Atributos.all(),
			Medicao: producaoSrv.QS.all(),
			Identificadores: '',
			instance: null,
			
			select: select,
			gravar: gravar,
			cancel: cancel
		});
		
		var _copy = null;
		
	
		////////////////////////
		
		function init() {
		    if (produto) {
			var copy = angular.copy(produto);
			angular.extend(vm, produto);
			vm.instance = produto;
		    }
		}
		
		function select(evt, atributo, valor) {
		    return atributo.selectValor(valor);
		}
		
		
		
		function gravar() {
		    var produto = producaoSrv.Produtos.create(vm);

		    cancel();
		    return produto;
		}
		
		function edit() {
		    var produto = producaoSrv.Produtos.create(vm);
		    producaoSrv.Produtos.remove(_copy);
		    
		    cancel();
		    return produto;
		}
		
		function cancel() {
		    vm.Atributos.forEach(function(atributo) {
			atributo.unselectValor();
		    });
		    
		    vm.Medicao.forEach(function(medida) {
			medida.reset();
		    });
		    
		    return vm;
		}
		
		/////////////////////////
		
		
		init();
		
		return vm;
	}
	
})(window.angular);