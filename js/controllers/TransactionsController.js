angular.module('app.controllers').
  controller('TransactionsController', ['$scope', 'FilteredTransactionsService',
    function($scope, FilteredTransactionsService) {

      $scope.FilteredTransactionsService = FilteredTransactionsService;

      $scope.gridOptions = {
        data: 'FilteredTransactionsService.transactions',
        columnDefs: [   {field:'Date', displayName:'Date'},
                        {field:'Description', displayName:'Description'},
                        {field:'Category', displayName:'Category'},
                        {field:'Amount', displayName:'Amount'}
                    ],
        scrollThreshold: 100,
        enablePaging: false,
        showFooter: false
      };
}]);