;
(function (angular, undefined) {
    'use strict';

    angular
        .module('encrypt')
        .factory('encryptService', ['cryptojs', encryptService]);
    
    function encryptService(cryptojs) {
        var cipher = cryptojs.AES;
        
        var service = {
            hash: hash,
            encrypt: encrypt,
            decrypt: decrypt
        };
        
        return service;
        
        /// implementation ///
        function hash(value) {
            return cryptojs.SHA3(value).toString();
        }
        
        function encrypt(value, key){
            return cipher.encrypt(value, key).toString();
        }
        function decrypt(value, key){
            return cipher.decrypt(value, key);
        }
    }
    
})(window.angular);