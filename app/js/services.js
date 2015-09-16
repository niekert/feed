/**
 * Created by NiekKruse on 9/16/15.
 */

var instagramService = angular.module('instagramService', ['ngResource']);

instagramService.factory('Instagram', ['$resource', 'appSettings',
    function ($resource, appSettings) {
        return $resource("https://api.instagram.com/v1/tags/:tag/media/recent?client_id=:clientID", {"callback": "JSON_CALLBACK",  "clientID": appSettings.clientID}, {
            queryTags: {
                method:'JSONP',
                params: {"tag": "@tag"},
                isArray:false,
                withCredentials:true
            }
        });
    }]);
