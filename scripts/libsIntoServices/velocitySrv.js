;
(function (angular, Velocity, $, undefined) {
    'use strict';

    angular
        .module('app.libs')
        .factory('Velocity', function(){
            return Velocity || $.fn.velocity;
    });

})(window.angular, window.Velocity, window.jQuery);