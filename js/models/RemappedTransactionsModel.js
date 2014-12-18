/*
 *  A service to persist raw transactions, as imported directly from Mint
*/
angular.module('app.models').
  service('RemappedTransactionsModel', ['$rootScope', 'TransactionsModel', 'CategoryRemappingModel',
    function($rootScope, TransactionsModel, CategoryRemappingModel) {

      this.transactions = [];

      // refresh transactions
      var refresh = function() {
        var newTransactions = [];
        for (var i = 0; i < TransactionsModel.transactions.length; i++) {
          var transaction = TransactionsModel.transactions[i];
          var category = transaction.Category;
          if (CategoryRemappingModel.mintCategoryMap.hasOwnProperty(category)) {
            category = CategoryRemappingModel.mintCategoryMap[category];
            var newTransaction = jQuery.extend({'Category': category}, transaction);
            this.newTransactions.add(newTransaction);
          }
        }
        this.transactions = newTransactions;
      };

      $rootScope.$watch('TransactionsModel.transactions', refresh);
}]);
