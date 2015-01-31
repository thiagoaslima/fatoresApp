;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.storage', [])
	.constant('nomeEntidades', [
	    'atividade',
	    'atividadeTarefa',
	    'cenario',
	    'cenarioValor',
	    'empresa',
	    'funcao',
	    'obra',
	    'tarefa'
	])
	.constant('abbr', {
	    // namespaces
	    'database': 'db',
	    'usuarios': 'us',
	    'levantamentos': 'lv',
	    // dados
	    'datas': 'dt',
	    'dados': 'dd',
	    // entidades
	    'atividade': 'av',
	    'atividadeTarefa': 'at',
	    'cenario': 'cn',
	    'cenarioValor': 'cv',
	    'empresa': 'em',
	    'funcao': 'fc',
	    'obra': 'ob',
	    'tarefa': 'tf',
	    // levantamentos
	    'recursos': 'lr',
	    'cenarios': 'lc',
	    'producao': 'lp'
	})
	.constant('extenso', {
	    // namespaces
	    'db': 'database',
	    'us': 'usuarios',
	    'lv': 'levantamentos',
	    // dados
	    'dt': 'datas',
	    'dd': 'dados',
	    // entidades
	    'av': 'atividade',
	    'at': 'atividadeTarefa',
	    'cn': 'cenario',
	    'cv': 'cenarioValor',
	    'em': 'empresa',
	    'fc': 'funcao',
	    'ob': 'obra',
	    'tf': 'tarefa',
	    // levantamentos
	    'lr': 'recursos',
	    'lc': 'cenarios',
	    'lp': 'producao'
	})
	.constant('ordem', {
	    'atividade': ['AtividadePaiId', 'AtividadesFilhas',
		'AtividadesTarefa', 'Cor', 'DataAtualizacao', 'DuracaoMaxima',
		'DuracaoMinima', 'Id', 'Nome', 'Status'],
	    'atividadeTarefa': ['Atividade', 'AtividadeId', 'DataAtualizacao',
		'DataCriacao', 'Id', 'Levantamentos', 'ParticipaQS',
		'PercentualQS', 'PercentualQS2', 'PercentualQS3', 'Status',
		'Tarefa', 'TarefaId']
	})
//	.run(['Sessions', function (Sessions) {
//		return Sessions.current();
//	    }])
	;

})(window.angular);