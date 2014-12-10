;
(function (angular, undefined) {
    'use strict';

    angular.module('fatoresApp')
        .constant('Siglas', {
            // namespaces
            'database': 'db',
            'usuarios': 'us',
            
            // entidades
            'atividade': 'av',
            'atividadeTarefa': 'at',
            'cenario': 'cn',
            'cenarioValor': 'cv',
            'empresa': 'em',
            'funcao': 'fc',
            'obra': 'ob',
            'tarefa': 'tf'
        });
//        .config(
//            ['localStorageServiceProvider', function (localStorageServiceProvider) {
//                    localStorageServiceProvider
//                        .setPrefix('fatores.v1.')
//                        .setStorageType('localStorage');
//                }
//            ]);
}(window.angular));