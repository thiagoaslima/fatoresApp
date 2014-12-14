;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$q', '$http', '$timeout', 'logger', 'dbUrl'];
    function dataservice($q, $http, $timeout, logger, dbUrl) {
        return {
            requestToken: requestToken,
            // Low level API
            get: get
//            post: post
        };

        function requestToken(username, password) {
            return get({
                item: 'token',
                username: username,
                password: password
            }, 60);
        }

        function get(item, options, timeout) {
            var _item = item,
                _options = options,
                _timeout = timeout;

            if (typeof options === 'number') {
                _timeout = options;
                _options = {};
            }

            if (typeof item === 'object') {
                if (item.item) {
                    _item = item.item;
                    delete(item.item);
                    _options = item;
                }
            }

            var request = _get(_item, (_options || {}));

            // automatiza tempo para cancelar a requisição
            // padrão de 45 segundos
            var cancel = $timeout(function () {
                if (request && angular.isFunction(request.abort)) {
                    request.abort();
                }
            }, _timeout * 1000 || 45 * 1000);

            return request;
        }


        function _get(item, options) {
            // seleciona qual o complemento de dbUrl
            // e identifica a solicitação do sistema

            if (typeof item !== 'string' && typeof options !== 'object') {
                logger.error({
                    title: 'dataservice.js: xhr request',
                    msg: 'Argumentos no formato errado'
                });
                throw new Error('argumento no formato errado');
                return false;
            }

            // based on 
            // http://www.bennadel.com/blog/2616-aborting-ajax-requests-using-http-and-angularjs.htm
            // The timeout property of the http request takes a deferred value
            // that will abort the underying AJAX request if / when the deferred
            // value is resolved.
            var deferredAbort = $q.defer();

            // Initiate the AJAX request.
            var request = $http({
                method: "get",
                url: dbUrl + item,
                timeout: deferredAbort.promise,
                params: options
            });

            // Rather than returning the http-promise object, we want to pipe it
            // through another promise so that we can "unwrap" the response
            // without letting the http-transport mechansim leak out of the
            // service layer.
            var promise = request.then(
                function databaseSuccess(response) {
                    return(response.data);
                },
                function databaseFail(response) {
                    return($q.reject(response));
                }
            );

            // Now that we have the promise that we're going to return to the
            // calling context, let's augment it with the abort method. Since
            // the $http service uses a deferred value for the timeout, then
            // all we have to do here is resolve the value and AngularJS will
            // abort the underlying AJAX request.
            promise.abort = function () {
                deferredAbort.resolve();
            };

            // Since we're creating functions and passing them out of scope,
            // we're creating object references that may be hard to garbage
            // collect. As such, we can perform some clean-up once we know
            // that the requests has finished.
            promise.finally(
                function () {
                    promise.abort = angular.noop;
                    deferredAbort = request = promise = null;
                }
            );

            return(promise);
        }
    }

})(window.angular);