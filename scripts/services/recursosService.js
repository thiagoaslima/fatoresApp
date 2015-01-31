;
(function (angular, undefined) {
    'use strict';

    angular.module('app.services')
        .factory('Recursos',
            ['Equipe', 'Entidades', 'ConfigurationService', 'hashByIdFilter', 'removeDuplicatesFilter', recursos]);

    function recursos(Equipe, Entidades, Config, hashById, removeDuplicates) {
        var _membros = [],
            _selectedMembers = [],
            _atividades = [],
            _comentarios = {};

        var model = {
            atividades: {
                delegaveis: [],
                gerais: [],
                aguardando: null
            },
            comentarios: {
                all: allComentarios,
                new: createComentario
            }
        };

        init();


        //////////////////


        function setMembro(membro) {
            Equipe.add(membro);
            return membro;
        }

        function removeMembro(membro) {
            Equipe.remove(membro);
	    return membro;
        }

        function addActivity(membros, atividade) {
            membros = angular.isArray(membros) ? membros : [membros];
            
            if (!atividade || membros.length === 0) {
                return;
            }

            membros.forEach(function (membro) {
		membro.changeAtividade(atividade);
            });

            return membros;
        }

        function selectMembro(membro) {
            _selectedMembers.push(membro);
            membro.isSelected = true;
            return membro;
        }
        function unselectMembro(membro) {
            var idx = _selectedMembers.indexOf(membro);
            if (idx > -1) {
                _selectedMembers.splice(idx, 1);
            }

            membro.isSelected = false;
            return membro;
        }
        function getSelected() {
            return _selectedMembers;
        }
        
        
        // Comentarios
        function Comentario(obj) {

        }
        function createComentario() {
            
        }
        function allComentarios() {
            return Object.keys(_comentarios).map(function(key) {
                return _comentarios[key];
            });
        }
        
        /////////////////////
        
        return model;
        
    }
})(window.angular);