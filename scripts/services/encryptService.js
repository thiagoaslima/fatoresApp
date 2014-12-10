/**
 * Módulo para encriptar dados
 * Utiliza e depende do script CryptoJS
 * https://code.google.com/p/crypto-js/
 */
'use strict';

angular
    .module('encrypt', [])
    .factory('EncryptService', ['$window',
        function encryptSrv(global) {
            var hash = global.CryptoJS.SHA3;
            var cipher = global.CryptoJS.AES;

            /**
             * gera o conteúdo encriptado
             * @param   {String} value
             * @returns {String} 256-bit string
             */
            this.hash = function encryptHash(value) {
                return hash(value).toString();
            };
            
            this.cipher = {};
            /**
             * gera um conteúdo passível de descompactação
             * @param {String} value conteúdo a ser encriptado
             * @param {String} key frase secreta de codificação
             * @return {String} 256-bit string
             */
            this.cipher.encrypt = function cypherEncrypt(value, key) {
                return cipher.encrypt(value, key).toString();
            };
            
            this.cipher.decrypt = function cipherDecrypt(value, key) {
                return cipher.decrypt(value, key);
            };
            return this;
        }
    ]);
