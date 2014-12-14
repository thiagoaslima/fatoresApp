;
(function (angular, undefined) {
    'use strict';

    angular
            .module('app.storage')
            .factory('storage', ['nomeEntidades', 'abbr', 'extenso', 'ordem', 'localStorageService', storage]);

    function storage(nomes, abbr, extenso, ordem, localstorage) {
        var _cache = {};

        return {
            get: get,
            set: set
        };

        function get(name) {
            if (_cache[name]) {
                return _cache[name];
            }

            var obj = manager(name, localstorage.get(compact(name)), descompact);
            _cache[name] = obj;
            return obj;
        }

        function set(name, data) {
            _cache[name] = data;
            var obj = manager(name, angular.copy(data), compact);
            localstorage.set(compact(name), obj);
            return obj;
        }

        function manager(name, el, fn) {
            if (el === null) {
                return el;
            }
            
            var obj = {};
            Object.keys(el).forEach(function (key) {
                obj[fn(key)] = fn(el[key], name + '.' + key);
                delete(el[key]);
            });
            console.log(obj);
            
            return obj;
        }

        function compact(el, name) {
            if (angular.isString(el)) {
                return abbr[el] || el;
            }
            
            if (angular.isArray)

            if (angular.isObject(el)) {
                return manager(name, el, compact);
            }
        }
        
        function descompact(el, name) {
            if (el === null) {
                return el;
            }

            if (angular.isString(el)) {
                return extenso[el] || el;
            }

            if (angular.isObject(el)) {
                return manager(name, el, descompact);
            }
        }
    }

})(window.angular);