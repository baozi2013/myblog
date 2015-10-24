/**
 * Created by tianhengzhou on 9/2/15.
 */
var app = angular.module('myApp', ['angularUtils.directives.dirPagination']);
app.controller('customersCtrl',["$scope", '$http', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $http.get('/data').success(function (data) {
        $scope.posts = data
    });
    $http.get('/articleData').success(function (data) {
        $scope.articles = data
    });
    $http.get('/categories').success(function (data) {
        $scope.categories = data
    });
    $scope.categoryquery = function(category){
        $scope.categoryq = category;
    };
}]);
app.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);



