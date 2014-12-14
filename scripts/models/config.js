;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.models')
        .factory('Config', ['Empresas', Config]);
    
    function Config(Empresas) {
        var service = {};
        
        activate();
        
        return service;
        
        ///////////////////////
        
        function activate() {
            var empresas = Empresas.get();
        }
    }
     
})(window.angular);