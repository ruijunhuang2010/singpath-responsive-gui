'use strict';

//var myApp = angular.module('myApp', ['ngResource', 'analytics']);
var myApp = angular.module('dnd', ['ngResource','ngCookies']);

myApp.run(function($rootScope, $location) {
    $rootScope.location = $location;
});
