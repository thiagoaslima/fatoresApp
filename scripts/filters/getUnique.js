;
(function (angular, undefined) {
    "use strict";

    angular.module('app.filters')
        .filter('getUnique', getUnique);

    function getUnique(array) {
        var n = {},
            r = [],
            len = array.length;
        for (var i = 0; i < len; i++)
        {
            if (!n[array[i]])
            {
                n[array[i]] = true;
                r.push(array[i]);
            }
        }
        return r;
    }

}(window.angular));