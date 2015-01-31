;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.layout')
        .controller('Configuracao', [
            '$scope',
            'filterFilter',
            'dados',
            'ConfigurationService',
            Configuracao
        ]);

    function Configuracao($scope, filter, dados, service) {
        // botão de confirmação
        $scope.buttons = {
            ok: {
                disabled: true
            }
        };
        
        var vm = this;

        var idEmpresas = dados.obra.map(function (obra) {
            return obra.EmpresaId;
        });

        angular.extend(vm, {
            selected: {},
            Empresas: checkIds(dados.empresa, idEmpresas),
            Empreendimentos: [],
            Obras: [],
            Fracoes: [],
            Subfracoes: [],
            Contratadas: [],
            Tarefas: []
        });

        $scope.$watch('vm.selected.Empresa', function (newVal, oldVal) {
            console.log('$watch 1');
            if (newVal !== oldVal) {
                vm.Empreendimentos = checkIds(dados.obra,
                    vm.selected.Empresa.Obras).filter(function (obra) {
                    return obra.ObraId === null;
                });
            }
        });

        $scope.$watch('vm.selected.Empreendimento', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                vm.Obras = filter(dados.obra, {ObraId: newVal.Id});
                vm.selected.Obra = {};
                if (!vm.Obras.length) {
                    console.log('$w2 contratadas');
                    vm.Contratadas = checkIds(dados.empresa,
                        vm.selected.Empreendimento.Contratadas);
                }
            }
        });

        $scope.$watch('vm.selected.Obra', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                vm.Fracoes = filter(dados.obra, {ObraId: newVal.Id});
                vm.selected.Fracao = {};
                if (!vm.Fracoes.length) {
                    console.log('$w3 contratadas');
                    vm.Contratadas = checkIds(dados.empresa,
                        vm.selected.Obra.Contratadas);
                }
            }
        });

        $scope.$watch('vm.selected.Fracao', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                vm.Subfracoes = filter(dados.obra, {ObraId: newVal.Id});
                vm.selected.Subfracao = {};
                if (!vm.Subfracoes.length) {
                    console.log('$w4 contratadas');
                    vm.Contratadas = checkIds(dados.empresa,
                        vm.selected.Obra.Contratadas);
                }
            }
        });

        $scope.$watch('vm.selected.Subfracao', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                vm.Contratadas = checkIds(dados.empresa,
                    vm.selected.Obra.Contratadas);
                vm.selected.Contratada = {};
            }
        });

        $scope.$watch('vm.selected.Contratada', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                vm.Tarefas = checkIds(dados.tarefa,
                    vm.selected.Contratada.Tarefas);
                vm.selected.Tarefa = {};
            }
        });

        $scope.$watch('vm.selected.Tarefa', function (newVal, oldVal) {
            if (newVal && newVal !== oldVal && !angular.equals({}, newVal)) {
                $scope.buttons.ok.disabled = false;
            }
            if (!newVal || angular.equals({}, newVal)) {
                $scope.buttons.ok.disabled = true;
            }
        });

        function checkIds(itens, array) {
            if (!array) {
                return [];
            }

            return itens.filter(function (item) {
                return array.indexOf(item.Id) > -1;
            });
        }
    }

})(window.angular);