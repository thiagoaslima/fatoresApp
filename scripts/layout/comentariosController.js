;
(function (angular, undefined) {
    'use strict';

    angular
	.module('app.layout')
	.controller('comentariosController',
	['$state', '$timeout', 'Equipe', 'Comentarios', 'Sessions', comentariosCtrl]);

	function comentariosCtrl($state, $timeout, Equipe, Comentarios, Sessions) {
	    var vm = this;

	    angular.extend(vm, {
		Equipe: Equipe.all(),
		selected: {
		    Equipe: Equipe.getSelecionados()
		},
		div: [],
		Texto: '',
		//// methods
		toggle: toggle,
		reset: reset,
		gravar: gravar
	    });

	    return vm;


	    ////////////////////////////

	    function toggle(evt, membro) {
		if (evt.target.tagName.toLowerCase() === 'input') {
		    return;
		}

		if (membro.isSelected) {
		    return Equipe.deselect(membro);
		}
		return Equipe.select(membro);
	    }

	    function reset() {
		Equipe.deselectAll();
		vm.texto = '';
		return true;
	    }

	    function gravar() {
		var comentario = Comentarios.new(vm.texto);

		vm.selected.Equipe.forEach(function (membro) {
		    membro.addComentario(comentario);
		});
		
		Sessions.current().saveRecursos();

		reset();
	    }
	    
	}

    })(window.angular);