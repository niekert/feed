/**
 * Created by NiekKruse on 9/16/15.
 */

var instafeedControllers = angular.module('instafeedControllers', []);

instafeedControllers.controller('FeedContainerCtrl', ['$scope', 'Instagram',
    function ($scope, Instagram) {
        $scope.isLoading = false;
        $scope.tagText = "";
        $scope.tagQuery = "";
        $scope.images = [];

        $scope.keyPressed = function ($event) {
            console.log($event.keyCode);

            switch($event.keyCode){
                case 13: //Enter key
                    $scope.tagQuery = $scope.tagText;
                    loadImages();
                    break;
                case 32: //space
                    $event.stopImmediatePropagation();
                    break;
            }
        };

        function loadImages(){
            $scope.isLoading = true;
            $scope.images = [];

            Instagram.queryTags({"tag": $scope.tagQuery}, function(data){
                $scope.isLoading = false;
                window.insta = data.data;
                $scope.images = data.data;
            });
        }

    }
]);