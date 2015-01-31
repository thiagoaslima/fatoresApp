;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.levantamentos')
        .factory('Levantamentos',
            ['ConfigurationService', 'User', 'Entidades', 'groupByFilter', levantamentos]);

    function levantamentos(Config, User, Entidades, groupBy) {
        var Empresa,
            Obra,
            Usuario,
            Tarefa,
            Contratada,
            atividadesTarefa;


        var _recursos = [];

        var service = {
            recursos: {
                registrar: registrar
            },
            cenarios: {
            },
            producao: {
            }
        };

        init();

        return service;


        /////////////////////
        function init() {
            Empresa = Config.select('Empresa').Id;
            Obra = Config.select('Subfracao') || Config.select('Fracao') ||
                Config.select('Obra') || Config.select('Empreendimento');
            Obra = Obra.Id;
            Usuario = User.getId();
            Tarefa = Config.select('Tarefa').Id;
            Contratada = Config.select('Contratada').Id;
        }


        function registrar(membros, atividade, hora) {
            var registros = groupBy(membros, function (item) {
                return [item.Recurso, item.Comentarios];
            });

            var closes = registros.map(function (array) {
                return close(array, hora);
            });

            registros.forEach(function (array, i) {
                if (typeof closes[i] !== 'boolean') {
                    array.forEach(function (membro) {
                        membro.Recurso = new Recurso(membro, atividade, closes[i]);
                        _recursos.push(membro.Recurso);
                    });
                } else {
                    array.forEach(function (membro) {
                        membro.Recurso = new Recurso(membro, atividade, hora);
                        _recursos.push(membro.Recurso);
                    });
                }
            });

            console.log(_recursos);
            return membros;
        }

        function Recurso(membro, atividade, hora) {
            this.AtividadeTarefaId = atividadeToAtivTarefa(atividade);
            this.EmpresaId = Empresa;
            this.ObraId = Obra;
            this.UserId = Usuario;
            this.Atividade = atividade.Id;
            this.Tarefa = Tarefa;
            this.Contratada = Contratada;
            this.FuncaoId = membro.Funcao.Id;
            this.Inicio = hora;

            return this;
        }
        Recurso.prototype.close = function() {
            
        };

        function atividadeToAtivTarefa(atividade) {
            var atividadesTarefa = Entidades.get('atividadeTarefa',
                atividade.AtividadesTarefa, true);
            return atividade.AtividadesTarefa.filter(function (id) {
                return atividadesTarefa[id].TarefaId === Tarefa;
            })[0];
        }

        function close(array, hora) {
            var base = array[0];
            var Recurso = angular.copy(base.Recurso) || null;

            if (!Recurso) {
                return true;
            }

            var duracaoMinima = base.Atividade.DuracaoMinima === 0 ?
                30 * 1000 : base.Atividade.DuracaoMinima;
            var duracaoMaxima = base.Atividade.DuracaoMaxima === 0 ?
                Number.POSITIVE_INFINITY : base.Atividade.DuracaoMaxima;

            array.forEach(function (membro) {
                var idx = _recursos.indexOf(membro.Recurso);
                _recursos.splice(idx, 1);
                membro.Recurso = null;
            });

            // checa se a atividade durou o tempo mínimo
            if (hora - Recurso.Inicio < duracaoMinima) {
                return Recurso.Inicio;
            }
            
            var QtdeColaboradores = array.length;
            var Colaboradores = array.map(function (membro) {
                return membro.Nome;
            }).join(', ');
            var Comentario = base.Comentarios ? base.Comentarios.join('\n') : "";
            var dateFormat = JSON.stringify(hora);

            // checa se a atividade excedeu o tempo máximo
            if (hora - Recurso.Inicio > duracaoMaxima) {
                var fim = new Date(
                    Recurso.Inicio.getTime() + duracaoMaxima * 1000);
                var fimFormat = JSON.stringify(fim);

                end(Recurso, fimFormat);
               
                return newDate(fim.getTime() + 1000);
            }

            end(Recurso, dateFormat);

            return true;

            function end(recurso, hora) {
                recurso = closeRecurso(recurso, {
                    QuantidadeColaboradores: QtdeColaboradores,
                    Comentario: Comentario,
                    Colaboradores: Colaboradores,
                    Fim: hora,
                    DataCriacao: hora,
                    DataAtualiacao: hora
                });
                _recursos.push(recurso);
                return recurso;
            }
        }

        function closeRecurso(recurso, obj) {
            recurso.Inicio = JSON.stringify(recurso.Inicio);
            angular.extend(recurso, obj);
            return recurso;
        }

    }

})(window.angular);