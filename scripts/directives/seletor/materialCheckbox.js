;
(function (angular, undefined) {
    'use strict';

    angular.module('app.directives')
        .value('checkboxsCreated', (function () {
            var value = 0;

            return {
                get: function () {
                    return value;
                },
                add: function () {
                    value += 1;
                }
            };
        }()))
        .directive('materialCheckbox',
            ['$timeout', 'checkboxsCreated', materialCheckbox]);

    var template = [
        '<div class="lista-options-group">',
        '<input type="{{::type}}" id="{{::id}}" name="{{::name}}">',
        '<label for="{{::id}}">',
        '<span></span>',
        '<span class="check"></span>',
        '<span class="box"></span>',
        '{{label}}',
        '</label>',
        '</div>'
    ].join('');

    function materialCheckbox($timeout, checkboxsCreated) {
        return {
            priority: 99,
            restrict: 'AE',
            template: template,
            replace: true,
            transclude: true,
            scope: {
                type: '@',
                id: '@',
                name: '@',
                label: '@'
//                ngModel: '=',
//                ngValue: '=',
//                valueSelected: '=selected'
            },
            link: linker
        };

        function linker(scope, elem, attrs) {
            checkboxsCreated.add();
            scope.id = 'material-checkbox-' + checkboxsCreated.get();
            
            attrs.$observe('id', function (newValue) {
                scope.id = newValue;
            });
            scope.type = scope.type || 'checkbox';


            elem.on('click', 'input', animateSelection);
            console.log(elem.find('input'));

            var animationEvt = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';

            function animateSelection(evt) {
//                var evtCopy = angular.copy(evt);
                console.log('checkbox', evt.target);

                var el = elem.find('label').children().eq(0);
                el.addClass('circle');
                var newone = el.clone(true);
                el.before(newone);
                el.remove();
                el = null;
                newone.on(animationEvt, removeCircleClass);

                return true;

                function removeCircleClass() {
                    newone.removeClass('circle');
                    newone.off(animationEvt, removeCircleClass);
                }
            }
        }
    }

}(window.angular));