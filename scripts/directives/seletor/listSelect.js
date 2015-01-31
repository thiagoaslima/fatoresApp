;
(function (jQuery, angular, undefined) {
    'use strict';

    angular
        .module('app.directives')
        .directive('listSelect', listSelect)
        .directive('listSelectOptions',
            ['$rootScope', 'Velocity', listSelectOptions])
//            .controller('listSelectController', listSelectController)
        ;

    var template = [
        '<div class="lista-item">',
        '<h3 class="lista-title" ng-if="title">{{::title}}</h3>',
        '<div class="lista-tiles">',
        '<div ng-if="icon" class="tile-left"></div>',
        '<div class="tile-content">',
        '<ng-transclude></ng-transclude>',
        '</div>',
        '</div>'
    ].join('');

    function listSelect() {
        return {
            restrict: 'AE',
            template: template,
            transclude: true,
            replace: true,
            priority: 2,
            scope: {
                title: '@'
            }
        };
    }

    // list-select-options
    var templateOption = [
        '<div class="lista-item-options">',
        '<h3 class="lista-item-title" ng-if="title">{{::title}}</h3>',
        '<h4 class="lista-item-subtitle" ng-if="subtitle">{{::subtitle}}</h4>',
        '<div class="lista-item-selecoes">',
        '<p class="lista-item-selecionado muted" ng-if="array.length === 0">Nenhuma opção disponível</p>',
        '<p class="lista-item-selecionado muted" ng-if="listOption.existOptions()">Selecione uma das opções</p>',
        '<p class="lista-item-selecionado" ng-if="listOption.selectedOption()">{{model[modelName][property]}}</p>',
        '<div class="lista-options">',
        '<div class="lista-options-group" ng-repeat="instance in array">',
        '<cefen-radio type="{{::type}}" title="{{::title || modelName}}" index="{{::$index}}" name="{{::name}}" model="model[modelName]" value="instance" prop="{{::property}}"></cefen-radio>',
        '</div>',
        '</div>',
        '</div>'
    ].join('');

    function listSelectOptions($rootScope, Velocity) {
        return {
            restrict: 'AE',
            replace: true,
            template: templateOption,
//            require: '^listSelect',
            scope: {
                type: '@',
                name: '@',
                title: '@',
                subtitle: '@',
                modelName: '@',
                property: '@value',
                model: '=',
                array: '=ngModel'
            },
            link: linkerOption,
            controller: ['$scope', optionCtrl],
            controllerAs: 'listOption'
        };

        function optionCtrl($scope) {
            var vm = this;

            angular.extend(vm, {
                existOptions: existOptions,
                selectedOption: selectedOption
            });

            return vm;

            function existOptions() {
                var model = $scope.model[$scope.modelName];
                return !!$scope.array.length &&
                    (!model || model.length === 0 ||
                        angular.equals({}, model));
            }

            function selectedOption() {
                var model = $scope.model[$scope.modelName];
                return !!$scope.array && !!model &&
                    (!angular.equals({}, model) || model.length);
            }
        }

        function linkerOption(scope, element, attrs) {
            scope.modelName = scope.modelName || scope.title;
            scope.name = scope.name || scope.title;

            attrs.$observe('array', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (newVal && newVal.length === 1) {
                        element.find('label').click();
                    }
                    return newVal;
                }
            });

            //////////////////////
            // fx
            var showOptions = false;
            var emitter = false;

            var $main = angular.element('main');
            var mainOffset = parseInt($main.css('padding-top')) * -1;

            var $el = angular.element(element);
            var $options = $el.find('.lista-options');
            var $itemSelecionado = $el.find('.lista-item-selecionado');

            $options.css({
                display: 'none',
                height: 'auto'
            });
            Velocity($options, {
                width: 0
            }, 1);

            $el.on('click', prepareToggle);
            scope.$on('listSelect:close', broadcast);

            ///////////////////////
            // clean up
            scope.$on("$destroy", function () {
                $el.off('click', prepareToggle);
                scope.off('listSelect:close', broadcast);
                $main = $el = $options = $itemSelecionado = null;
            });


            ///////////////////    

            function prepareToggle($event) {
                if ($event.target.nodeName.toLowerCase() === 'input') {
                    $event.preventDefault();
                }

                emitter = true;
                $rootScope.$broadcast('listSelect:close');

                if (scope.array && scope.array.length) {
                    toggle();
                }
            }

            function broadcast() {
                if (showOptions && !emitter) {
                    toggle();
                }
                emitter = false;
            }

            function toggle() {
                showOptions = !showOptions;

                if (showOptions) {
                    Velocity($itemSelecionado, {
                        opacity: 0
                    }, {
                        duration: 200
                    });

                    Velocity($options, {
                        width: '100%',
                        opacity: 1
                    }, {
                        duration: 150,
                        queue: false
                    });
                    Velocity($options, 'slideDown', {
                        duration: 300,
                        queue: false,
                        complete: function (elem) {
                            Velocity(element, 'scroll', {
                                container: $main,
                                duration: 200,
                                offset: mainOffset
                            });
                        }
                    });
                } else {
                    Velocity($itemSelecionado, {
                        opacity: 1
                    }, 200);
                    Velocity($options, 'slideUp', {duration: 250});
                    Velocity($options, {
                        width: 0,
                        opacity: 0
                    }, {
                        duration: 150,
                        delay: 100,
                        queue: false
                    });
                }
                return true;
            }
        }
    }

}(window.jQuery, window.angular));