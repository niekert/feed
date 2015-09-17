/**
 * Created by NiekKruse on 9/16/15.
 *
 * App definition for instafeed
 */

var instafeedApp = angular.module('instafeedApp', [
    'ngRoute',
    'ngMaterial',
    'instafeedControllers',
    'stateServiceModule',
    'instagramService'
]);

instafeedApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            'templateUrl': '/partials/feed-container.html',
            'controller': 'FeedContainerCtrl'
        }).when('/authorize', {
            'templateUrl': '/partials/authorize.html',
            'controller': 'AuthorizeCtrl'
        }).otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
    }]);

instafeedApp.constant("appSettings", {
    "clientID": "c0529330871448c18e840cd78c537628",
    "baseUrl": "http://localhost:3474/",
    "apiBaseUrl": "https://api.instagram.com/v1/"//DONT LOOK
});
