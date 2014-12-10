// Pressupõe o uso do módulo ui.router
;
(function (angular) {
    'use strict';

    angular
            .module('fatoresApp')
            .directive('pageTitle', [
                function () {
                    return {
                        link: function (scope) {

                            var listener = function (event, toState) {
                                scope.page = scope.page || {};
                                scope.page.title = (toState.data && toState.data.pageTitle)
                                        ? toState.data.pageTitle
                                        : 'Default title';
                            };

                            scope.$on('$stateChangeSuccess', listener);
                        }
                    };
                }
            ]);

}(window.angular));