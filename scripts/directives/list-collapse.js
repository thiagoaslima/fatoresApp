;
(function (angular, undefined) {
    'use strict';

    // DEPENDE DE JQUERY

    angular
	.module('app.directives')
	.directive('listCollapse', ['$rootScope', listCollapse])
	.directive('listCollapseItem',
	    ['$rootScope', '$timeout', 'Velocity', listCollapseItem])
	;

    function listCollapse($rootScope, $timeout, Velocity) {
	return {
	    restrict: 'A',
	    compile: compile,
	    controller: ['$element', '$attrs', ListSelectController],
	    scope: {},
	    controllerAs: 'listCollapse',
	    bindToController: true
	};

	function compile() {
	    return {
		pre: link
	    };
	}

	function link(scope, element, attrs) {
	    var listCollapse = scope.listCollapse.collapse;
	    var name = attrs.listCollapse;
	    var EVENT = 'listCollapse:close' + (name ? ':' + name : name);

	    element.on('click', collapse);
	    scope.$on(EVENT, function (evt, emitter) {
		if (element !== emitter) {
		    listCollapse.close();
		}
		return true;
	    });

	    scope.$on('scroll', scroll);
	    function scroll(evt, emitter, offset) {
		if (element === emitter) {
		    angular.element('body').animate({
			scrollTop: offset - 112
		    });
		}
		return true;
	    }

	    scope.$on('$destroy', function () {
		element.off('click', collapse);
		scope.listCollapse = null;
	    });

	    function collapse(event) {
		if (event.target.nodeName.toLowerCase() === 'input') {
		    event.preventDefault();
		    return;
		}
		listCollapse.toggle();
		$rootScope.$broadcast(EVENT, element);
	    }
	}
    }

    function ListSelectController($element, $attrs) {
	var ctrl = this;
	var callbacks = [];

	ctrl.collapse = {
	    show: false,
	    toggle: function () {
		this.show = !this.show;
		this.execute(this.show);
	    },
	    close: function () {
		this.show = false;
		this.execute();
	    },
	    register: function (callback) {
		callbacks.push(callback);
	    },
	    unregister: function (callback) {
		callbacks = callbacks.map(function (cb) {
		    if (cb === callback) {
			return angular.noop;
		    }
		    return cb;
		});
	    },
	    execute: function (val) {
		callbacks.forEach(function (cb) {
		    cb(val, $element);
		});
	    }
	};

	if ($attrs.open) {
	    ctrl.collapse.show = true;
	}

	if ($attrs.scroll) {
	    ctrl.scroll = $attrs.scroll;
	}

	return ctrl;
    }


    function listCollapseItem($rootScope, $timeout, Velocity) {
	return {
	    restrict: 'A',
	    require: '^listCollapse',
	    scope: {},
	    link: linker
	};

	function linker(scope, element, attrs, parentCtrl) {
	    var normal = (typeof attrs.invertItem !== 'string');
	    var $main = angular.element('#' + parentCtrl.scroll);
	    var mainOffset = parseInt($main.css('padding-top'), 10) + 30;
	    var first = true;

	    var open = normal ? _open : _close;
	    var close = normal ? _close : _open;

	    parentCtrl.collapse.register(updateState);
	    element.css({
		display: 'none'
	    });

	    scope.$on('$destroy', function () {
		parentCtrl.collapse.unregister(updateState);
		$main = null;
	    });

	    function updateState(newVal, emitter) {
		return newVal ? open(emitter) : close(emitter);
	    }



	    function _open(emitter) {

		Velocity(element, {
		    width: '100%',
		    opacity: 1
		}, {
		    duration: 150,
		    queue: false
		});
		Velocity(element, 'slideDown', {
		    duration: 300,
		    complete: function () {
			$rootScope.$broadcast('scroll', emitter, element.position().top);
		    }
		});
	    }

	    function _close() {
		Velocity(element, 'slideUp', {duration: 250});
		Velocity(element, {
		    width: 0,
		    opacity: 0
		}, {
		    duration: 150,
		    delay: 100,
		    queue: false
		});
	    }
	}
    }

})(window.angular);
