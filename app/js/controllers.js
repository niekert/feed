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

        var spacePressed = false;

        $scope.keyPressed = function ($event) {
            spacePressed = false;
            switch($event.keyCode){
                case 13: //Enter key
                    $scope.tagQuery = $scope.tagText;
                    loadImages();
                    break;
                case 32: //space
                    $event.stopImmediatePropagation();
                    $event.preventDefault();
                    spacePressed = true; //very ugly workaround
                    break;
            }
        };

        $scope.tagChanged = function(){
            if(spacePressed)
            {
                $scope.tagText = $scope.tagText.substr(0, $scope.tagText.length -1);
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