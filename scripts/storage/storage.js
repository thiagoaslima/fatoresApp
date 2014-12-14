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

            Object.keys(el).forEach(function(key){
               var fnKey = fn(key) || key; 
               el[fnKey] = fn(el[key], fnKey);
               delete(el[key]);
            });
            return el;
        }
        
        function compact(el, name) {
            if (angular.isString(el)) {
                return abbr[el];
            }
            
            if (angular.isArray(el)) {
                if (nomes.indexOf(name) > -1) {
                    return ordem[name].map(function(key) {
                        return el[key]; 
                    });
                }
                // else
                return el;
            }
            
            if (angular.isObject(el)) {
                return manager(el, compact);
            }
        }
        function descompact(el, name) {
            if (el === null) {
                return el;
            }
            
            if (angular.isString(el)) {
                return extenso[el];
            }
            
            if (angular.isArray(el)) {
                if (nomes.indexOf(extenso[name]) > -1) {
                    var obj = {};
                    ordem[name].forEach(function(key, idx) {
                        obj[key] = el[idx];
                    });
                    return obj;
                }
                //else
                return el;
            }
            
            if (angular.isObject(el)) {
                return manager(el, descompact);
            }
        }
    }
    
})(window.angular);