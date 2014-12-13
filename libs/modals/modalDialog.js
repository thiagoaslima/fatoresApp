;
(function (angular, undefined) {
    'use strict';

    angular.module('dialogs', [])
        .factory('Modal', modal);
    
    modal.$inject = [];
    function modal() {
        return {
          open: open,
          close: close
        };
        
        function open(options) {
            
        }
    }
}(window.angular));