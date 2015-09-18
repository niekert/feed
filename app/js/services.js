/**
 * Created by NiekKruse on 9/16/15.
 */

var instagramService = angular.module('instagramService', ['ngResource']);

instagramService.factory('Instagram', ['$resource', 'appSettings', 'stateService',
    function ($resource, appSettings, stateService) {
        return {
            tags: $resource(appSettings.apiBaseUrl + "tags/:tag/media/recent?client_id=:clientID", {
                "callback": "JSON_CALLBACK",
                "clientID": appSettings.clientID
            }, {
                queryTags: {
                    method: 'JSONP',
                    params: {"tag": "@tag"},
                    isArray: false,
                    withCredentials: true
                }
            }),
            feed: $resource(appSettings.apiBaseUrl + "users/self/feed", {
                "callback": "JSON_CALLBACK",
                "access_token": stateService.getAuthCode,
                'count':20
            }, {
                query: {
                    method: 'JSONP',
                    params: {'maxID': '@maxID'}
                }
            }),
            users: $resource(appSettings.apiBaseUrl + "users/search", {
                "callback":"JSON_CALLBACK",
                "access_token":stateService.getAuthCode
            }, {
                query: {
                    method:'JSONP',
                    params:{'q': '@q'}
                }
            }),
            user: $resource(appSettings.apiBaseUrl + "users/:userID", {
                "callback": "JSON_CALLBACK",
                'client_id': appSettings.clientID,
                "access_token": stateService.getAuthCode
            }, {
                query: {
                    method: 'JSONP',
                    params: {'userID': '@userID'},
                    isArray: false,
                    withCredentials: true
                }
            })
        };

    }]);

var stateService = angular.module('stateServiceModule', []);

stateService.service("stateService", function () {
    var authCode = "";
    this.isAuthenticated = false;
    this.user = null;

    this.setAuthCode = function (apiAuthCode) {
        authCode = apiAuthCode;
        this.isAuthenticated = true;
    };

    this.getAuthCode = function(){
        return authCode;
    }

    this.signout = function(){
        authCode = "";
        this.user = null;
    }
});