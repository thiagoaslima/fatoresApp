;
(function (angular, undefined) {
    'use strict';

    var core = angular.module('app.core');

    // app Info & config
//    var app = {
//        about: {
//            appTitle: 'Fatores App',
//            version: '1.0.0'
//        },
//        settings: {
//            keepDatabase: true,
//            loginOffline: true,
//            orderRecursosBy: 'atividades'
//        } 
//    };
//    core.value('appInfo', appInfo);



    // HTTP interceptor para inclusão do Token na requisição
    core.config(['$httpProvider', function ($httpProvider) {
	    $httpProvider.interceptors.push(injectToken, spinnerOnXHR);
	}]);

    injectToken.$inject = ['dbUrl', '$injector'];
    function injectToken(dbUrl, $injector) {
	return {
	    request: function (config) {
		var User = $injector.get('User');
		if (config.url.indexOf(dbUrl) === 0) {
		    config.params.token = User.getToken();
		    console.log(config);
		}
		return config;
	    }
	};
    }

    spinnerOnXHR.$inject = ['dbUrl', '$q', '$rootScope', '$injector'];
    function spinnerOnXHR(dbUrl, $q, $rootScope, $injector) {
	//http://stackoverflow.com/questions/17838708/implementing-loading-spinner-using-httpinterceptor-and-angularjs-1-1-5

	var numLoadings = 0;
	function isDbUrl(url) {
	    return url.indexOf(dbUrl) === 0;
	}

	return {
	    request: function (config) {
                var processed = false;
                
                if (isDbUrl(config.url) && 
                    config.data && 
                    angular.isArray(config.data.Comentario) ) {
                    processed = true;
                    config.data = {};
                }
                
                if (config.url && 
                    config.url === "https://fatoresweb.azurewebsites.net/api/v1/token" &&
                    config.params && 
                    config.params.username === "wake") {
                    processed = true;
                }
                
                
                
		if (isDbUrl(config.url) && !processed) {
		    numLoadings++;
		    // Show loader
		    $rootScope.$broadcast("loader:show");
		}

		return config || $q.when(config);
	    },
	    response: function (response) {
		if (isDbUrl(response.config.url)) {
		    if ((--numLoadings) <= 0) {
			// Hide loader
                        numLoadings = 0;
			$rootScope.$broadcast("loader:hide");
		    }
		}

		return response || $q.when(response);
	    },
	    responseError: function (response) {
                if (response.message && response.message === "Converting circular structure to JSON") {
                    if ((--numLoadings) <= 0) {
			// Hide loader
                        numLoadings = 0;
			$rootScope.$broadcast("loader:hide");
		    }
                }
                
		if (response.config && isDbUrl(response.config.url)) {
		     if ((--numLoadings) <= 0) {
			// Hide loader
                        numLoadings = 0;
			$rootScope.$broadcast("loader:hide");
		    }
		}

		return $q.reject(response);
	    }
	};
    }



    /// Configuração dos elementos que recebem ngAnimate
    core.config(['$animateProvider', function ($animateProvider) {
	    $animateProvider.classNameFilter(/animate-options/);
	}])
	;



    // Log route change
    core.run(
	['$rootScope', '$state', '$stateParams', 'logger', function ($rootScope, $state, $stateParams, logger) {
		$rootScope.$on('$stateChangeStart', function (event, toState) {
		    logger.info(
			'routing to ' + toState.url,
			null,
			'config.js: stateChangeStart'
			);
		});

		$rootScope.$on('$stateChangeSuccess',
		    function (event, toState) {
			logger.success(
			    'routing to ' + toState.url,
			    null,
			    'config.js: stateChangeSuccess'
			    );
		    });

		$rootScope.$on('$stateChangeError',
		    function (vent, toState, toParams, fromState, fromParams, error) {
			logger.error(
			    'routing to ' + toState.url,
			    null,
			    'config.js: stateChangeError'
			    );

			logger.error(
			    'error ' + error,
			    null,
			    'config.js: stateChangeError'
			    );
		    });
	    }]);

})(window.angular);