;
(function (angular, undefined) {
    'use strict';

    angular.module('app.layout')
	.controller('recursosController',
	    ['$scope', '$state', '$modal', 'Equipe', 'AtividadesService', 'Levantamentos', 'authservice', recursosCtrl]);

    function recursosCtrl($scope, $state, $modal, Equipe, Atividades, Levantamentos, auth) {
	var vm = this;

	vm.Atividades = Atividades.delegaveis().filter(
	    function (atividade) {
		return atividade.Membros && atividade.Membros.length;
	    });
	vm.Equipe = Equipe.all();


	vm.change = function (evt, array, dest) {
	    evt.stopPropagation();
	    Equipe.select(array);
	    $state.go(dest);
	};

	vm.finalizar = function (hora) {
	    return Levantamentos.send(hora).finally(function () {
		openConfirmModal();
	    });
	};

	vm.openModal = openModal;
	$scope.horario = null;

	function openModal() {
	    var template = [
		'<div class="modal-header section">',
		'<h3 class="modal-title section-content section-content-header">Qual horário de fechamento das atividades?</h3>',
		'</div>',
		'<div class="modal-body section-content">',
		'<timepicker ng-model="horario" hour-step="1" minute-step="1" show-meridian="ismeridian"></timepicker>',
		'</div>',
		'<div class="modal-footer section">',
		'<button class="btn btn-cancel" ng-click="cancel()">Cancelar</button>',
		'<button class="btn btn-ok" ng-click="ok()">OK</button>',
		'</div>'
	    ].join('');

	    var modalInstance = $modal.open({
		template: template,
		size: 'sm',
		controller: ['$scope', '$modalInstance', 'horario', function ($scope, $modalInstance, horario) {
			$scope.horario = horario;

			$scope.ok = function () {
			    $modalInstance.close($scope.horario);
			};

			$scope.cancel = function () {
			    $modalInstance.dismiss('cancel');
			};
		    }],
		resolve: {
		    horario: function () {
			return new Date();
		    }
		}
	    });

	    modalInstance.result.then(function (hora) {
		vm.finalizar(hora || new Date());
	    }, function () {
		console.info('Modal dismissed at: ' + new Date());
	    });
	}

	function openConfirmModal() {
	    var template = [
		'<div class="modal-header section">',
		'<h3 class="modal-title section-content section-content-header">Selecione sua próxima ação:</h3>',
		'</div>',
//                '<div class="modal-body section-content">',
//                '<timepicker ng-model="horario" hour-step="1" minute-step="1" show-meridian="ismeridian"></timepicker>',
//                '</div>',
		'<div class="modal-footer section">',
		'<button class="btn btn-cancel" ng-click="cancel()">Continuar</button>',
		'<button class="btn btn-ok" ng-click="ok()">Fazer logoff</button>',
		'</div>'
	    ].join('');

	    var modalInstance = $modal.open({
		template: template,
		size: 'lg',
		controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
			$scope.ok = function () {
			    $modalInstance.close();
			};

			$scope.cancel = function () {
			    $modalInstance.dismiss('cancel');
			};
		    }]
	    });

	    modalInstance.result.then(function () {
		Equipe.reset();
		auth.logout();
	    }, function () {
		Equipe.aguardando();
		$state.reload();
	    });
	}
    }
})(window.angular);