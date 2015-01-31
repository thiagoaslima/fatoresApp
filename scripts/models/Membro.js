;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.models')
        .factory('Membros', ['sortBrFilter', 'safellyRemoveFilter', membros]);

    function membros(sort, safellyRemove) {

        var model = {
            new : newMembro
        };

        function newMembro(obj) {
            return new Membro(obj);
        }

        function Membro(obj) {
            this.Nome = obj.Nome;
            this.Experiencia = obj.Experiencia;
            this.isSelected = false;

            this.setFuncao(obj.Funcao);
            this.setAtividade(obj.Atividade);
            this.setRecurso(null);

            return this;
        }

        Object.defineProperties(Membro.prototype, {
            setFuncao: setProp(setFuncao),
            unsetFuncao: setProp(unsetFuncao),
            setAtividade: setProp(setAtividade),
            unsetAtividade: setProp(unsetAtividade),
            changeAtividade: setProp(changeAtividade),
            addComentario: setProp(addComentario),
            removeComentario: setProp(removeComentario),
            removeTodosComentarios: setProp(removeTodosComentarios),
            setRecurso: setProp(setRecurso),
            unsetRecurso: setProp(unsetRecurso),
            select: setProp(selected),
            deselect: setProp(deselected),
            printRegistros: setProp(printRegistros),
            delete: setProp(erase)
        });



        function setFuncao(funcao) {
            this.Funcao = funcao;
            funcao.Membros = funcao.Membros || [];
            funcao.Membros.push(this);
            funcao.Membros = sort(funcao.Membros, 'Nome');
            return this;
        }

        function unsetFuncao() {
            var funcao = this.Funcao;
            this.Funcao = null;
            safellyRemove(funcao.Membros, this);
            return this;
        }



        function setAtividade(atividade) {
            this.Atividade = atividade;
            atividade.Membros = atividade.Membros || [];
            atividade.Membros.push(this);
            atividade.Membros = sort(atividade.Membros, 'Nome');
            return this;
        }

        function unsetAtividade() {
            var atividade = this.Atividade;
            this.Atividade = null;
            safellyRemove(atividade.Membros, this);
            return this;
        }

        function changeAtividade(atividade) {
            if (this.Atividade !== atividade) {
                this.unsetAtividade();
                this.setAtividade(atividade);
            }
            return this;
        }

        function setRecurso(recurso) {
            this.Recurso = recurso;
        }
        function unsetRecurso() {
            this.Recurso = null;
        }

        function addComentario(comentario) {
//	    this.Comentarios.push(comentario);
            if (!this.Recurso) {
                return this;
            }
            this.Recurso.addComentario(comentario);
            comentario.addMembro(this);
            return this;
        }
        function removeComentario(comentario) {
//	    safellyRemove(this.Comentarios, comentario);
            if (!this.Recurso) {
                return this;
            }
            this.Recurso.removeComentario(comentario);
            comentario.removeMembro(this);
            return this;
        }
        function removeTodosComentarios() {
            if (!this.Recurso) {
                return this;
            }

            if (angular.isArray(this.Recurso.Comentarios)) {
                angular.copy(this.Recurso.Comentarios).forEach(function (comentario) {
                    this.removeComentario(comentario);
                });
            }

            return this;
        }

        function selected() {
            this.isSelected = true;
            return this;
        }
        function deselected() {
            this.isSelected = false;
            return this;
        }

        function printRegistros() {
            var comentarios = '';
            if (this.Recurso && this.Recurso.Comentarios && this.Recurso.Comentarios.length) {
                comentarios = (this.Recurso.Comentarios.length === 1) ?
                    ' • 1 comentário' : ' • ' + this.Recurso.Comentarios.length + ' comentários';
            }

            return this.Funcao.Nome + comentarios;
        }

        function erase() {
            this.unsetAtividade();
            this.unsetFuncao();
            this.removeTodosComentarios();
            this.unsetRecurso();
            return this;
        }

        function setProp(value, enumerable) {
            return {
                value: value,
                enumerable: !!enumerable
            };
        }


        ///////////
        return model;
    }

})(window.angular);