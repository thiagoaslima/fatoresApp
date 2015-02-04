;
(function (angular) {
	'use strict';

	angular
		.module('app.layout')
		.controller('cenariosController', [
			'$state',
			'$modal',
			'cenariosService',
			'safellyRemoveFilter',
			cenariosCtrl
		]);

	function cenariosCtrl($state, $modal, cenariosService, safellyRemove) {
		var vm = this;

		angular.extend(vm, {
			todos: cenariosService.all(),
			select: select,
			reset: reset,
			gravar: gravar
		});

		var modified = [];
		var tabHidden = false;

		////////////////////////////////////

		function select(evt, cenario, valor) {
			if (evt && evt.target &&
				evt.target.tagName.toLowerCase() === 'input') {
				return;
			}

			cenario.selectValor(valor);

			if (cenario.isDirty) {
				modified.push(cenario);
			} else {
				safellyRemove(modified, cenario);
			}

			if (modified.length) {
				_hideTabs();
			} else {
				_showTabs();
			}
		}


		function _hideTabs() {
			if (!tabHidden) {
				angular.element('#tabs').addClass('hidden-tabs');
				angular.element('main').addClass('hidden-tabs');
				tabHidden = true;
			}
		}

		function _showTabs() {
			if (tabHidden) {
				angular.element('#tabs').removeClass('hidden-tabs');
				angular.element('main').addClass('hidden-tabs');
				tabHidden = false;
			}
		}

		function reset() {
			modified.forEach(function (cenario) {
				cenario.selectValor(cenario.OldValue);
				cenario.pristine();
			});

			modified = [];
			_showTabs();
			return true;
		}

		function gravar() {
			var hora = new Date();

			modified = modified.map(function (cenario) {
				return cenario.update(hora);
			}).filter(function (cenario) {
				return cenario.isDirty;
			});

			reset();
			$state.go('recursos');
		}


		////////////////////////////////////

		return vm;
	}
})(window.angular);