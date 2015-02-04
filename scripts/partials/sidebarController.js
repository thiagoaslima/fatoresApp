;
(function (angular, undefined) {
	'use strict';

	angular
		.module('app.layout')
		.controller('sidebarController',
			['$rootScope', 'authservice', 'User', sidebar]);

	function sidebar($root, auth, user) {
		$root.showSidebar = false;
		this.UserName = user.getName();
		this.logout = auth.logout;

		this.toggleSidebar = function () {
			$root.showSidebar = !$root.showSidebar;
			return;
		};

		return this;
	}

})(window.angular);