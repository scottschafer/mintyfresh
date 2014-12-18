/*
 *  A service to provide remapped and filtered transactions
*/
angular.module('app.services').
  service('FilteredTransactionsService', ['$rootScope', 'TransactionsModel', 'CategoryRemappingModel',
    function($rootScope, TransactionsModel, CategoryRemappingModel) {

      this.transactions = [];
      var self = this;

      // refresh transactions
      var refresh = function() {
        var newTransactions = [];
        for (var i = 0; i < TransactionsModel.transactions.length; i++) {
          var transaction = TransactionsModel.transactions[i];
          var category = transaction.Category;
          if (CategoryRemappingModel.categoryRemapping.hasOwnProperty(category)) {
            category = CategoryRemappingModel.categoryRemapping[category];
            var newTransaction = $.extend({}, transaction, {'Category': category});
            //var newTransaction = jQuery.extend({'Category': category}, transaction);
            newTransactions.push(newTransaction);
          }
          else {
            newTransactions.push(transaction);
          }
        }
        self.transactions = newTransactions;
      };

      $rootScope.$watch('TransactionsModel.transactions', refresh);
      $rootScope.$watch('CategoryRemappingModel.categoryRemapping', refresh);
}]);
