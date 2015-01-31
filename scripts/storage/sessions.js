;
(function (angular, undefined) {
    'use strict';
    angular
	.module('app.storage')
	.factory('Sessions', ['$q', '$timeout', 'localStorageService', 'RecursosModel', sessions]);
    function sessions($q, $timeout, storage, Recurso) {
	var service = {
	    restore: restoreSession,
	    current: current,
	    save: save
	};
	
	var _session = null;
	var _sessions = {};
	var _oldSessions = null;
	var _dataFim = null;
	
	//////////////// 
	
	function init() {
	    _oldSessions = storage.get('sessions');
	    _oldSessions = _oldSessions ? _oldSessions : {};
	    
	    var promises = {};
	    
	    var keys = Object.keys(_oldSessions);
	    keys.forEach(function (key) {
		var session = service.restore(_oldSessions[key]);
		
		promises[session.Id] = session.endSession().then(function(obj) {    
		    obj.session.Recursos = obj.value;
		    var relevance = obj.session.checkRelevance();
		    Recurso.reset();
		    
		    if (!relevance) {
			delete(_oldSessions[key]);
		    } else {
			_oldSessions[key] = obj.session;
		    }
		    
		    return;
		});
	    });
	    
	    $q.all(promises).finally(function() {
		angular.extend(_sessions, _oldSessions);
		service.save();
	    });
	    
	    _session = new Session();
	    _session.updateDataFim();
	    
	    _sessions[_session.Id] = _session;
	    return _session;
	}


	function restoreSession(obj) {
	    var session = new Session(obj.Id);
	    session.DataFim = obj.DataFim;
	    session.setConfig(obj.Config);
	    session.setRecursos(obj.Recursos);
	    return session;
	}

	function current() {
	    return _session;
	}
	
	function save() {
	    _session.DataFim = new Date().toISOString();
	    storage.set('sessions', _sessions);
	    return;
	}
	
	//////////////////////////////

	function Session(id) {
	    this.Id = id || new Date().toISOString();
	    this.DataInicio = this.Id;
	    return this;
	}

	Object.defineProperties(Session.prototype, {
	    updateDataFim: setMethod(updateDataFim),

	    setConfig: setMethod(setConfig),
	    setRecursos: setMethod(setRecursos),
	    
	    saveConfig: setMethod(saveConfig),
	    saveRecursos: setMethod(saveRecursos),
	    
	    endSession: setMethod(endSession),
	    checkRelevance: setMethod(checkRelevance)
	});
	
	
	function updateDataFim() {
	    var session = this;
	    service.save();
	    _dataFim = $timeout(function() {
		session.updateDataFim();
	    }, 15 * 60 * 1000); // atualiza o término de 15 em 15 minutos
	    return session;
	}
	
	
	
	function setConfig(obj) {
	    var config = {};
	    angular.extend(config, obj);
	    this.Config = config;
	    return this;
	}

	function setRecursos(array) {
	    var session = this;
	    
	    if (!array || array.length === 0) {
		session.Recursos = [];
		return;
	    }
	    
	    session.Recursos = array.filter(function(obj) {
		if (!obj || Object.keys(obj).length === 0) {
		    return false;
		}
		return true;
	    }).map(function (obj) {
		var recurso = Recurso.new(obj);
		
		if (recurso.isOpen()) {
		    var closed = recurso.close(new Date(session.DataFim));
		    return closed;
		} else {
		    return recurso;
		}
		
	    }).filter(function(recurso, idx, array) {
		return array.indexOf(recurso) === idx;
	    });
	    
	    return session;
	}



	function saveConfig(obj) {
	    this.Config = obj;
	    service.save();
	    return this;
	}
	
	function saveRecursos() {
	    var array = angular.copy(Recurso.all()).map(function(obj) {
		if (obj.Atividade) {
		   delete(obj.Atividade);
		   
		   if(obj.Comentarios && angular.isArray(obj.Comentarios)) {
		       obj.Comentarios = obj.Comentarios.map(function(comentario) {
			   delete(comentario.Membros);
			   return comentario;
		       });
		   }
		}
		return obj;
	    });
	    this.Recursos = array;
	    service.save();
	    return this;
	}

	function endSession() {
	    var self = this;
	    var defer = $q.defer();
	    var promises = {};
	    
	    promises['Recursos'] = _sendRecursos(self.Recursos);
	    
	    $q.all(promises).then(function (obj) {
		defer.resolve({
		    session: self,
		    value: obj
		});
	    });
	    
	    return defer.promise;
	}

	function checkRelevance() {	    
	    if ( (!this.Recursos || !this.Recursos.length) &&
		 (!this.Producao || !this.Producao.length) &&
		 (!this.Cenarios || !this.Cenarios.length) ){
		delete(_oldSessions[this.Id]);
		return false;
	    }
	    
	    return true;
	}

	function _sendRecursos(array) {
	    var defer = $q.defer();
	    var promises = [];
	    if (!array || array.length === 0) {
		defer.resolve();
	    }

	    array.forEach(function (recurso) {
		promises.push(_post(recurso));
	    });
	    
	    // Os recursos enviados que forem salvos retornarão false
	    // e aqueles que não forem salvos retornarão o próprio objeto
	    $q.all(promises).then(function (resp) {
		resp = resp.filter(function(item) {
		    return !!item;
		});
		defer.resolve(resp);
	    });
	    return defer.promise;
	}
	
	// Os recursos enviados que forem salvos retornarão false
	// e aqueles que não forem salvos retornarão o próprio objeto
	function _post(recurso) {
	    return recurso.post().then(function(resp) {
		if (resp.status === 200) {
		    return false;
		}

		if (resp.status === 500) {
		    if (resp.data.InnerException &&
			resp.data.InnerException.InnerException &&
			resp.data.InnerException.InnerException.ExceptionMessage &&
			resp.data.InnerException.InnerException.ExceptionMessage.indexOf(
			    'Cannot insert duplicate key row in object') === 0) {
			    return false;
		    }
		}
		
		return recurso;
	    });
	}

	
	function setMethod(value, enumerable) {
            return {
                value: value,
                enumerable: !!enumerable
            };
        }

	////////////////

	init();

	return service;
    }

})(window.angular);


// Status de Erros
// 0 - offline (conferir)
// 400 - propriedade faltando
// 500 - objeto repetido