;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.levantamentos')
	.factory('RecursosModel', ['dataservice', 'safellyRemoveFilter', recurso]);

    function recurso(dataservice, safellyRemove) {
	var service = {
	    new : newRecurso,
	    all: all,
	    reset: reset
	};

	var _recursos = {};

	//////////////////////////////

	function newRecurso(obj) {
	    return new Recurso(obj);
	}

	function all() {
	    return Object.keys(_recursos).map(function (key) {
		return _recursos[key];
	    });
	}

	function reset() {
	    _recursos = [];
	}

	function Recurso(obj) {
	    this.AtividadeTarefaId = obj.AtividadeTarefaId;
	    this.EmpresaId = obj.EmpresaId;
	    this.ObraId = obj.ObraId;
	    this.UserId = obj.UserId;
	    this.Atividade = obj.Atividade;
	    this.TarefaId = obj.TarefaId;
	    this.ContratadaId = obj.ContratadaId;
	    this.FuncaoId = obj.FuncaoId;
	    this.Inicio = obj.Inicio;
	    this.DataCriacao = obj.DataCriacao;
	    this.Colaboradores = obj.Colaboradores;
	    this.QuantidadeColaboradores = obj.QuantidadeColaboradores;
	    this.Comentarios = obj.Comentarios;
	    this.status = obj.status;

	    this.Fim = obj.Fim || null;
	    this.DataAtualizacao = obj.Fim || null;

	    this.Id = obj.Id || this.Inicio + this.FuncaoId + this.Colaboradores;

	    this.queue();
	    return this;
	}

	Object.defineProperties(Recurso.prototype, {
	    'identify': {
		value: identifyRegistro,
		enumerable: false
	    },
	    'close': {
		value: closeRegistro,
		enumerable: false
	    },
	    'queue': {
		value: queueRegistro,
		enumerable: false
	    },
	    'unqueue': {
		value: unqueueRegistro,
		enumerable: false
	    },
	    'toDate': {
		value: toDate,
		enumerable: false
	    },
	    'isOpen': {
		value: isOpen,
		enumerable: false
	    },
	    'post': {
		value: post,
		enumerable: false
	    },
	    addComentario: {
		value: addComentario,
		enumerable: false
	    },
	    removeComentario: {
		value: removeComentario,
		enumerable: false
	    },
	    comentariosId: {
		value: comentariosId,
		enumerable: false
	    },
	    comentariosToString: {
		value: comentariosToString,
		enumerable: false
	    }
	});

	function identifyRegistro() {
	    return this.Inicio + this.FuncaoId + this.Comentarios.toString();
	}

	function closeRegistro(hora) {
	    hora = hora.toISOString();

	    this.unqueue();

	    var newId = this.Inicio + hora + this.FuncaoId + this.comentariosId();

	    if (_recursos[newId]) {
		_recursos[newId].QuantidadeColaboradores = _recursos[newId].QuantidadeColaboradores + 1;
		_recursos[newId].Colaboradores = _recursos[newId].Colaboradores + ', ' + this.Colaboradores;
	    } else {
		this.Id = newId;
		this.Comentarios = this.comentariosToString();
		this.Fim = hora;
		this.DataAtualizacao = hora;
		this.status = 'closed';
		this.queue();
	    }

	    return _recursos[newId];
	}

	function queueRegistro() {
	    _recursos[this.Id] = this;
	    return this;
	}
	function unqueueRegistro() {
	    delete(_recursos[this.Id]);
	    return this;
	}

	function addComentario(comentario) {
	    this.Comentarios.push(comentario);
	    return this;
	}
	function removeComentario(comentario) {
	    safellyRemove(this.Comentarios, comentario);
	    return this;
	}
	function comentariosId() {
	    return this.Comentarios.map(function (comentario) {
		return comentario.Id;
	    }).toString();
	}
	function comentariosToString() {
	    return this.Comentarios.map(function (comentario) {
		return comentario.value;
	    }).join(' | ');
	}



	function toDate(prop) {
	    return prop ? new Date(this[prop]) : new Date(this.Inicio);
	}

	function isOpen() {
	    return this.status === 'open' ? true : false;
	}

	function post() {
	    var recurso = this;

	    var obj = {
		AtividadeTarefaId: this.AtividadeTarefaId,
		EmpresaId: this.ContratadaId,
		ObraId: this.ObraId,
		UserId: this.UserId,
		TarefaId: this.TarefaId,
		FuncaoId: this.FuncaoId,
		Inicio: this.Inicio,
		DataCriacao: this.DataCriacao,
		Colaboradores: this.Colaboradores,
		QuantidadeColaboradores: this.QuantidadeColaboradores,
		Comentario: this.Comentarios,
		Fim: this.Fim,
		DataAtualizacao: this.DataAtualizacao
	    };

	    return dataservice.post('levantamento', obj).then(function success(resp) {
		if (resp.status === 200) {
		    recurso.unqueue();
		}

		if (resp.status === 500) {
		    if (resp.data.InnerException &&
			resp.data.InnerException.InnerException &&
			resp.data.InnerException.InnerException.ExceptionMessage &&
			resp.data.InnerException.InnerException.ExceptionMessage.indexof(
			    'Cannot insert duplicate key row in object') === 0) {
			    recurso.unqueue();
		    }
		}
		
		return resp;
	    }, function error(err) {
		return err;
	    });
	}


	////////////////

	return service;
    }

})(window.angular);






