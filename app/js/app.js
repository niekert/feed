/**
 * Created by NiekKruse on 9/16/15.
 *
 * App definition for instafeed
 */

var instafeedApp = angular.module('instafeedApp',[
    'ngRoute',
    'instafeedControllers',
    'instagramService'
]);

instafeedApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider){
        $routeProvider.when('/', {
            'templateUrl': 'partials/feed-container.html',
            'controller': 'FeedContainerCtrl'
        }).otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
    }]);

instafeedApp.constant("appSettings", {
    "clientID": "7d5c7187bf1948b1b949cdb47143169a",
    "clientSecret": "430f9e714e7044268f33125f20b0e7b1"
});
