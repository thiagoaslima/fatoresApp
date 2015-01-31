;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app', ['ngMockE2E'])
        .run(['$httpBackend', '$timeout', returnData]);

    function returnData($httpBackend, $timeout) {
        var _lastId = {};
        var data = {
            empresas: [
                {
                    Id: 1,
                    RazaoSocial: 'Empresa A',
                    CNPJ: '12345',
                    Obras: ['1'],
                    ObrasContratada: []
                },
                {
                    Id: 2,
                    RazaoSocial: 'Empresa B',
                    CNPJ: '23456',
                    Obras: [],
                    ObrasContratada: [1]
                }
            ],
            obras: [
                {
                    Id: 1,
                    Nome: 'Obra A',
                    NumeroBlocos: 2,
                    Empresa: [1],
                    Contratadas: [2],
                    ObrasFilhas: [2],
                    ObraPai: null
                },
                {
                    Id: 2,
                    Nome: 'Obra B',
                    NumeroBlocos: null,
                    Empresa: [1],
                    Contratadas: [2],
                    ObrasFilhas: [],
                    ObraPai: 1
                },
                {
                    Id: 3,
                    Nome: 'Obra C',
                    NumeroBlocos: null,
                    Empresa: [1],
                    Contratadas: [2],
                    ObrasFilhas: [],
                    ObraPai: null
                }
            ]
        };

        $httpBackend.whenGET('/api/v0/empresas').respond(
            function (method, url, data) {
                return [200, 'hi', {}];
            });
//        $httpBackend.whenGET('/api/v0/obras').respond(data.obras);
        $httpBackend.whenGET(/^(?!\/api\/v0).*/).passThrough();

        $httpBackend.when('PUT', /^\/api\/v0\//).respond(
            function (method, url, params) {
                console.log(arguments);
                var entity = url.split('/')[3];
                var obj = JSON.parse(params).elem;
                data[entity].forEach(function (el, idx) {
                    if (parseInt(el.Id, 10) === parseInt(obj.Id)) {
                        data[entity][idx] = obj;
                    }
                });
                return [200, obj];
            }
        );

        $httpBackend.when('POST', /^\/api\/v0\//).respond(
            function (method, url, params) {
                console.log(arguments);
                var entity = url.split('/')[3];
                var obj = JSON.parse(params).elem;

                _lastId[entity] = _lastId[entity] || 0;

                if (_lastId[entity] === 0) {
                    data[entity].forEach(function (el) {
                        _lastId[entity] = el.Id > _lastId[entity] ? el.Id : _lastId[entity];
                    });
                }

                _lastId[entity] += 1;

                obj.Id = _lastId[entity];

                data[entity].push(obj);
                return [200, obj];
            }
        );

    }

}(window.angular));