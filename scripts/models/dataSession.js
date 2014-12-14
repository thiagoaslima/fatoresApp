;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.models')
        .factory('dataSession', dataSession);

    dataSession.$inject = ['$q', '$timeout', 'logger', 'User'];
    function dataSession($q, $timeout, logger, User) {
        return {
            init: init
        };

        function init() {
            var defer = $q.defer();
            logger.info({
                title: 'dataSession.js: Routing',
                msg: 'iniciando'
            });
//            $timeout(function() {
//                logger.info({
//                    title: 'Routing',
//                    msg: 'Indo para configuração'
//                });
                defer.resolve();
//            }, 3000);
            return defer.promise;
            
            // Empresas
            // Obras
            // Tarefas
        }
    }

})(window.angular);