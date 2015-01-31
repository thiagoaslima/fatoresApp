;
(function (angular, undefined) {
    "use strict";
    // http://stackoverflow.com/questions/12581439/how-to-add-custom-validation-to-an-angular-js-form
    
    angular.module('app.directives')
        .directive('blacklist', function () {
            return {
                require: 'ngModel',
                scope: {
                  blacklist: '=',
                  ngModel: '='
                },
                link: function (scope, elem, attr, ngModel) {
//                    var blacklist = JSON.parse(attr.blacklist);
//
//                    attr.$observe('blacklist', function(newVal) {
//                        blacklist = JSON.parse(attr.blacklist)
//                    });
                    var blacklist = scope.blacklist;

                    //For DOM -> model validation
                    ngModel.$parsers.unshift(function (value) {
                        var valid = blacklist.indexOf(value) === -1;
                        ngModel.$setValidity('blacklist', valid);
                        return valid ? value : undefined;
                    });

                    //For model -> DOM validation
                    ngModel.$formatters.unshift(function (value) {
                        ngModel.$setValidity('blacklist', blacklist.indexOf(
                            value) === -1);
                        return value;
                    });
                }
            };
        });
})(window.angular);