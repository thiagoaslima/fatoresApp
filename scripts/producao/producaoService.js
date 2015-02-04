;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.layout')
	.factory('producaoService', [
	    '$q',
	    'Entidades',
	    'ConfigurationService',
	    'Cenario',
	    'ProdutoModel',
	    'sortBrFilter',
	    producaoService
	]);

    function producaoService($q, entidades, config, Cenario, Produto, sort) {

	var service = {
	    Produtos: {
		all: all,
		create: create,
		remove: removeProduto,
		get: get,
		send: send
	    },
	    Atributos: {
		all: getAtributos,
		reset: resetAtributos
	    },
	    Nomes: {
		all: getNomes,
		registrar: registrarNome,
		remover: removerNome
	    },
	    QS: {
		all: allQS,
		reset: resetQS
	    }
	};

	var _produtos = [];
	var _nomes = [];
	var _atributos = [];
	var _medicao = [];


	/////////////////////////////

	function Medida(str, valor) {
	    this.Unidade = str;
	    this.Valor = valor;

	    return this;
	}

	Object.defineProperties(Medida.prototype, {
	    updateValor: setMethod(updateValor),
	    reset: setMethod(resetMedida),
	    toString: setMethod(toString)
	});

	function updateValor(newValue) {
	    this.Valor = newValue === 'm2' ? 'm²' : newValue;
	    return this;
	}
	
	function resetMedida() {
	    this.Valor = undefined;
	}

	function toString() {
	    return typeof this.Valor === undefined ? '' :
		this.Valor + ' ' + this.Unidade;
	}


	/////////////////////////////

	function init() {
	    var tarefa = config.select('Tarefa');

	    // inicia os atributos
	    var atributosValor = entidades.get('cenarioValor',
		tarefa.AtributosProducao, true);

	    var cenariosId = Object.keys(atributosValor).map(function (id) {
		return atributosValor[id].CenarioId;
	    }).filter(function (el, idx, array) {
		return array.indexOf(el) === idx;
	    });

	    entidades.get('cenario', cenariosId).map(function (cenario) {
		return Cenario.new(cenario);
	    }).forEach(function (atributo) {
		_atributos.push(atributo);
	    });
	    _atributos = sort(_atributos, 'Nome');


	    // inicializa a medição
	    var props = ['UnidadeMedida', 'UnidadeMedida2', 'UnidadeMedida3'];
	    props.forEach(function (prop) {
		if (tarefa[prop] !== '') {
		    _medicao.push(new Medida(tarefa[prop]));
		}
	    });

	    return service;
	}



	function all() {
	    return _produtos;
	}

	function create(obj) {
	    var produto = Produto.new(obj);
	    _produtos.push(produto);
	    _nomes.push(produto.Identificadores);
	    return produto;
	}
	
	function removeProduto(produto) {
	    safellyRemove(_produtos, produto);
	    safellyremove(_nomes, produto.Identificadores);
	    return produto;
	}

	function get(id) {
	    return _produtos.filter(function (prod) {
		return prod.Id === parseInt(id, 10);
	    })[0];
	}

	function send(hora) {
	    var defer = $q.defer();
	    
	    var promises = [];
	    _produtos.forEach(function(produto) {
		promises.push(produto.send(hora));
	    });
	    
	    $q.all(promises).then(function(resp) {
		resp = resp.filter(function(val) {
		    return !!val;
		});
		defer.resolve(resp);
	    });
	    
	    return defer.promise;
	}


	function getAtributos() {
	    return _atributos;
	}

	function resetAtributos() {
	    _atributos.forEach(function (attr) {
		attr.reset();
	    });
	    return _atributos;
	}



	function getNomes() {
	    return _nomes;
	}

	function registrarNome(produto) {
	    _nomes.push(produto.Identificadores);
	    return _nomes;
	}

	function removerNome(produto) {
	    safellyRemove(_nomes, produto.Identificadores);
	    return _nomes;
	}



	function allQS() {
	    return _medicao;
	}

	function resetQS() {
	    _medicao = [];
	    return _medicao;
	}

	////////////////////////////

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