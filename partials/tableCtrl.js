function tableCtrl($scope) {
    $scope.totalPages = $scope.me.page.pageCount;
    $scope.currentPage = 1;
    $scope.space = 6;

    $scope.prevPage = function () {
       if ($scope.currentPage > 1) {
           $scope.currentPage--;
       }
    };
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages ) {
            $scope.currentPage++;
        }
    };
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
    $scope.makearray = function (length) {
        var ret = [];        
        console.log(length);
      
        for (var i = 1; i == length; i++) {
            ret.push(i);
        }        
        console.log(ret);        
        return ret;
    };
}
