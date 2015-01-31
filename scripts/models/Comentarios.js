;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.models')
        .factory('Comentarios', ['sortBrFilter', 'safellyRemoveFilter', comentarios]);

    
    function comentarios(sort, safellyRemove) {
        
        var model = {
            all: all,
            new: newComentario
        };
        
        var _NUMERO_COMENTARIOS = 0;
        var _comentarios = [];
        
        ///////////////////////////
        
        function all() {
            return _comentarios;
        }
        
        function newComentario(value) {
            return new Comentario(value);
        }
        
        function Comentario(value) {
            this.Id = 'c_' + ++_NUMERO_COMENTARIOS;
            this.value = value;
            this.Membros = [];
            
            this.setValue(value);
            this.queue();
            
            return this;
        }
        
        Object.defineProperties(Comentario.prototype, {
            addMembro: setMethod(addMembro),
            removeMembro: setMethod(removeMembro),
            
            setValue: setMethod(setValue),
            unsetValue: setMethod(unsetValue),
            
            queue: setMethod(queue),
            unqueue: setMethod(unqueue),
            
	    printMembros: setMethod(printMembros),
            delete: setMethod(erase)
        });
        
        function addMembro(membros) {
            if (angular.isArray(membros)) {
                this.Membros = this.Membros.concat(membros);
            } else {
                this.Membros.push(membros);
            }
            this.Membros = sort(this.Membros, 'Nome');
            return this;
        }
        
        function removeMembro(membros) {
            membros = angular.isArray(membros) ? membros : [membros];
            membros.forEach(function(membro) {
                safellyRemove(this.Membros, membro);
            });
	    if (this.Membros.length === 0) {
		this.unqueue();
	    }
            return this;
        }
        
        
        
        function setValue(value) {
            this.value = value;
            return this;
        }
        
        function unsetValue() {
            this.value = '';
            return this;
        }
        
        
        function queue() {
            _comentarios.push(this);
            return this;
        }
        function unqueue() {
            safellyRemove(_comentarios, this);
            return this;
        }
        
        
        function printMembros() {
	    return this.Membros.map(function(membro) {
		return membro.Nome;
	    }).join(', ');
	}
        function erase() {
            this.Membros.forEach(function(membro) {
                membro.removeComentario(this);
            });
            this.unsetValue();
            this.unqueue();
            
            return _comentarios;
        }
        
        //////////
        
        function setMethod(value, enumerable) {
            return {
                value: value,
                enumerable: !!enumerable
            };
        }
        
        ///////////
        
        return model;
        
    }
    
})(window.angular);


