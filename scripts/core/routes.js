;
(function (angular, undefined) {
    'use strict';
    angular
	.module('app.core')
	.config(['$stateProvider',
	    '$urlRouterProvider',
	    '$locationProvider',
	    routing])
	.run(
	    ['$rootScope', '$state', '$stateParams', 'authservice', isLogged])
	;

    function isLogged($rootScope, $state, $stateParams, authservice) {
	$rootScope.$on('$stateChangeStart',
	    function (event, toState, toStateParam) {
		//console.log(toState);
		if (toState.auth) {
		    // Continue with the update and state transition if logic allows
		    if (authservice.isLogged()) {
			return true;
		    } else {
			// Halt state change from even starting
			event.preventDefault();
			return $state.go('login');
		    }
		}

		return true;
	    });
    }

    function routing($stateProvider, $urlRouterProvider, $locationProvider) {
	// retira o # da url
//        $locationProvider.html5Mode(true);

	// caso a url não seja nenhuma mapeada
	$urlRouterProvider.otherwise('/');
	$stateProvider
	    .state('login', {
		url: '/',
		auth: false,
		views: {
		    'content': {
			templateUrl: 'scripts/auth/login.html',
			controller: 'Login as vm'
		    }
		},
		resolve: {
		    'wakeup': ['$q', 'dataservice', function ($q, dataservice) {
			    var defer = $q.defer();
			    dataservice.get({
				item: 'token',
				username: 'wake',
				password: ''
			    }, 1).finally(function () {
				defer.resolve();
			    });
			    return defer.promise;
			}]
		}
	    })
	    .state('configuracao', {
		url: '/configuracao',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Configuração'
		    }
		},
		views: {
		    'content': {
			templateUrl: 'scripts/layout/configuracao.html',
			controller: 'Configuracao as vm',
			resolve: {
			    'dados': ['ConfigurationService', function (Config) {
				    return Config.get();
				}],
			    'session': ['$q', 'Sessions', function ($q, Session) {
				    var defer = $q.defer();
				    defer.resolve(
					Session.current());
				    return defer.promise;
				}]
			}
		    },
		    'toolbar': toolbar(),
		    'sidebar': sidebar()
		}
	    })
	    .state('equipe', {
		url: '/equipe',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Equipe'
		    },
		    footer: {
			buttons: {
			    ok: {
				title: 'Confirmar',
				toState: 'equipe'
			    }
			}
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/layout/equipe.html',
			controller: 'equipeController as equipe',
			resolve: {
			    'funcoes': ['Entidades',
				'ConfigurationService',
				'sortBrFilter',
				function (Entidades, Config, sort) {
				    var tarefa = Config.select(
					'Tarefa');
				    return sort(
					Entidades.get('funcao',
					    tarefa.Funcoes),
					'Nome');
				}]
			}
		    },
		    'toolbar': toolbar(),
		    sidebar: sidebar()
		}
	    })
	    .state('recursos', {
		url: '/recursos',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Recursos'
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/layout/recursos.html',
			controller: 'recursosController as recursos'
		    },
		    toolbar: toolbar(),
		    sidebar: sidebar(),
		    tabs: tabs()
		}
	    })
	    .state('comentarios', {
		url: '/comentarios',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Comentarios'
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/layout/comentarios.html',
			controller: 'comentariosController as comentarios'
		    },
		    toolbar: toolbar()
		}
	    })
	    .state('atividades', {
		url: '/atividades',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Atividades'
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/layout/atividades.html',
			controller: 'atividadesController as atividades'
		    },
		    toolbar: toolbar()
		}
	    })
	    .state('cenarios', {
		url: '/cenarios',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Cenários'
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/cenarios/cenarios.html',
			controller: 'cenariosController as cenarios'
		    },
		    toolbar: toolbar(),
		    sidebar: sidebar(),
		    tabs: tabs()
		}
	    })
	    .state('producao', {
		url: '/producao',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Produção'
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/producao/producao.html',
			controller: 'producaoController as producao'
		    },
		    toolbar: toolbar(),
		    sidebar: sidebar(),
		    tabs: tabs()
		}
	    })
	    .state('produtoNovo', {
		url: '/produto/novo',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Novo produto'
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/producao/produtoCreate.html',
			controller: 'produtoController as produto',
			resolve: {
			    Produto: [function () {
				    return null;
				}]
			}
		    },
		    toolbar: toolbar(),
		    sidebar: sidebar(),
		    tabs: tabs()
		}
	    })
	    .state('produto', {
		url: '/produto/:id',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: ''
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/producao/produto.html',
			controller: 'produtoController as produto',
			resolve: {
			    Produto: ['$state', '$stateParams', 'producaoService',
				function ($state, $stateParams, producaoService) {
				    var produto = producaoService.Produtos.get(
					$stateParams.id);
				    $state.$current.data.toolbar.pageTitle = produto.Identificadores;
				    return produto;
				}]
			}
		    },
		    toolbar: {
			templateUrl: 'scripts/partials/toolbar.html',
			controller: 'toolbarController',
			controllerAs: 'toolbar'
		    },
		    sidebar: sidebar(),
		    tabs: tabs()
		}
	    })
	    .state('produtoEdit', {
		url: '/produto/edit/:id',
		auth: true,
		data: {
		    toolbar: {
			pageTitle: 'Editar produto'
		    }
		},
		views: {
		    content: {
			templateUrl: 'scripts/producao/produtoEdit.html',
			controller: 'produtoController as produto',
			resolve: {
			    Produto: ['$stateParams', 'producaoService',
				function ($stateParams, producaoService) {
				    return producaoService.Produtos.get(
					$stateParams.id);
				}]
			}
		    },
		    toolbar: toolbar(),
		    sidebar: sidebar(),
		    tabs: tabs()
		}
	    })
	    .state('credits', {
		url: '/credits',
		templateUrl: 'credits.html',
		data: {
		    pageTitle: 'Credits'
		}
	    })
	    .state('estudo', {
		url: '/estudo',
		templateUrl: 'estudo.html'
	    });


	// partials config
	function toolbar() {
	    return {
		templateUrl: 'scripts/partials/toolbar.html',
		controller: 'toolbarController',
		controllerAs: 'toolbar'
	    };
	}

	function footer() {
	    return {
		templateUrl: 'scripts/partials/footer.html',
		controller: 'footerController',
		controllerAs: 'footer'
	    };
	}

	function sidebar() {
	    return {
		templateUrl: 'scripts/partials/sidebar.html',
		controller: 'sidebarController',
		controllerAs: 'sidebar'
	    };
	}

	function tabs() {
	    return {
		templateUrl: 'scripts/partials/tabs.html'
//                controller: 'tabsController',
//                controllerAs: 'tabs'
	    };
	}
    }

})(window.angular);