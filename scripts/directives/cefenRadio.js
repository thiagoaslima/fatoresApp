;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.directives')
        .directive('cefenRadio', cefenRadio)
        .directive('cefenRadioMultiple', cefenRadioMultiple)
        .controller('cefenRadioMultipleController', cefenRadioMultipleController)
        .value('cefenRadioQty', cefenRadioQty())
        .value('cefenRadioMaultipleQty', cefenRadioMultipleQty());


    // cefen-radio
    var templateRadio = [
        '<input type="checkbox" id="{{::title}}_{{::index}}" name="{{::name}}" ng-model="model" ng-true-value="{{::value}}">',
        '<label for="{{::title}}_{{::index}}">',
        '<span></span>',
        '<span class="check"></span>',
        '<span class="box"></span>',
        '{{::value[property]}}',
        '</label>'
    ].join('');

    function cefenRadio() {
        return {
            restrict: 'AE',
            template: templateRadio,
            scope: {
                title: '@',
                name: '@',
                index: '@',
                property: '@prop',
                model: '=',
                value: '='
            },
            compile: compile
        };
        
        function compile(tElem, tAttrs) {
            return link;
        }
        
        function link(scope, element) {
            var id = '#' + scope.title + '_' + scope.index;
            
            if (!scope.value) {
                element.removeAttr('ng-true-value');
            }
            if (!scope.action) {
                element.removeAttr('ng-click');
            }

            element.on('click', 'label', function(evt) {
                var $el = element.find(id);
                if ($el.prop('checked')) {
                    evt.preventDefault();
                }
            });
        }
    }

    function cefenRadioQty() {
        var value = 0;

        return {
            get: function () {
                return value;
            },
            add: function () {
                value += 1;
            }
        };
    }
    
    // cefen-radio
    var templateRadioMultiple = [
        '<input type="checkbox" id="{{::title}}_{{::index}}" name="{{::name}}_{{::index}}" ng-model="ngValue.__CRM__checked" ng-change="updateModel()">',
        '<label for="{{::title}}_{{::index}}">',
        '<span></span>',
        '<span class="check"></span>',
        '<span class="box"></span>',
        '{{::ngValue[property]}}',
        '</label>'
    ].join('');

    function cefenRadioMultiple() {
        return {
            restrict: 'AE',
            template: templateRadioMultiple,
            scope: {
                title: '@',
                name: '@',
                index: '@',
                property: '@prop',
                base: '=',
                model: '=',
                ngValue: '='
            },
            controller: cefenRadioMultipleController,
            controllerAs: 'CRMCtrl'
        };
    }

    cefenRadioMultipleController.$inject = ['$scope', '$filter'];
    function cefenRadioMultipleController($scope, $filter) {
        var filter = $filter('filter');
        $scope.updateModel = updateModel;
        
        function updateModel() {
            $scope.model = filter($scope.base, {__CRM__checked: true});
        }
    }
    
    function cefenRadioMultipleQty() {
        var value = 0;

        return {
            get: function () {
                return value;
            },
            add: function () {
                value += 1;
            }
        };
    }

}(window.angular));