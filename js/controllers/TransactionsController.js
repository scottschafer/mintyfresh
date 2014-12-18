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

      /*
            $scope.refreshTransactions = function(newVal) {
        // form a new list of transactions to display, with the categories appropriately remapped

        var newTransactions = [];
        for (var i = 0; i < TransactionsModel.transactions.length; i++) {
          var transaction = TransactionsModel.transactions[i];
          var category = transaction.Category;
          if (CategoryRemappingModel.mintCategoryMap.hasOwnProperty(category)) {
            category = CategoryRemappingModel.mintCategoryMap[category];
            var newTransaction = jQuery.extend({'Category': category}, transaction);
            newTransactions.push(newTransaction);
          }
          else {
            newTransactions.push(transaction);
          }
        }
        $scope.transactions = newTransactions;
      }

      // refresh the transactions if either the original transactions change or the category remappings change
      $scope.$watch(TransactionsModel.transactions, $scope.refreshTransactions);
      $scope.$watch(CategoryRemappingModel.transactions, $scope.refreshTransactions);
    */

    /*
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    $scope.totalServerItems = 0;

    $scope.pagingOptions = {
        pageSizes: [50, 100, 1000],
        pageSize: 50,
        currentPage: 1
    };  

  $scope.gridOptions = {
    data: 'RemappedTransactionsModel.transactions',
    columnDefs: [   {field:'Date', displayName:'Date'},
                    {field:'Description', displayName:'Description'},
                    {field:'Category', displayName:'Category'},
                    {field:'Amount', displayName:'Amount'}
                ],
    enablePaging: true,
    showFooter: true,
    pagingOptions: $scope.pagingOptions,
    filterOptions: $scope.filterOptions
};

    $scope.setPagingData = function(data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.transactions = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        var data = DataService.transactions;
        if (searchText) {
            var ft = searchText.toLowerCase();
            data = data.filter(function(item) {
                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                });
            $scope.setPagingData(data,page,pageSize);
        } else {
            $scope.setPagingData(data,page,pageSize);
        }
    };
    
    $scope.refreshTable = function() {
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }
    //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.refreshTable();
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.refreshTable();
        }
    }, true);
    */
}]);