;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.levantamentos')
	.factory('Levantamentos',
	    ['$q',
		'groupByFilter',
		'RecursosLev',
		'Sessions',
		'cenariosService',
		'producaoService',
		'logger',
		levantamentos]);

    function levantamentos($q, groupBy, RecursosLev, Sessions, cenariosService, producaoService, logger) {

	var service = {
	    recursos: {
		registrar: registrarRecursos
	    },
	    cenarios: {
	    },
	    producao: {
	    },
	    send: send
	};

	return service;

	/////////////////////

	function registrarRecursos(membros, atividade, hora) {
	    var recursosConcluidos = membros.map(function (membro) {
		return RecursosLev.close(membro.Recurso, hora);
	    });
	    membros.forEach(function (membro) {
		membro.Recurso = null;
	    });

	    // abre novos registros caso a atividade não seja Aguardando
	    if (atividade && atividade.Id > -1) {
		membros.forEach(function (membro, i) {
		    if (typeof recursosConcluidos[i] !== 'boolean') {
			membro.Recurso = RecursosLev.open(membro, atividade,
			    recursosConcluidos[i]);
		    } else {
			membro.Recurso = RecursosLev.open(membro, atividade,
			    new Date(hora.getTime() + 1000));
		    }
		});
	    }

	    Sessions.current().saveRecursos();
	    return membros;
	}

	function send(hora) {
	    var defer = $q.defer();

	    var promises = {
		recursos: RecursosLev.send(hora),
		cenarios: cenariosService.send(hora),
		producao: producaoService.Produtos.send(hora)
	    };

	    $q.all(promises).then(function (obj) {
		Sessions.current().saveRecursos();
		logger.info(
		    'levantamentos salvos',
		    null,
		    'levantamentos.js: send'
		    );
		defer.resolve(obj);
	    });

	    return defer.promise;
	}

    }

})(window.angular);