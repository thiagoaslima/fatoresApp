;
(function (angular, toastr, undefined) {
    'use strict';

    angular
        .module('blocks.logger', [])
        .value('toastr', toastr);
    
})(window.angular, window.toastr);