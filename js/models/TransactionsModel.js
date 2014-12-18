/*
 *	A service to persist raw transactions, as imported directly from Mint
*/
angular.module('app.models').
  service('TransactionsModel', ['$rootScope', 'LocalStorageService', function($rootScope, LocalStorageService) {

    // this is probably wrong, but it allows the CategoryRemappingModel to notice changes to the list of transactions
    // and refresh appropriately. Other suggestions are welcome
    $rootScope.TransactionsModel = this;

  	/**
  	 * The transactions.
  	 * An array of transaction objects, each with the following significant fields:
  	 	Date, Description, Amount, TransactionType, Category
  	 */
   	this.transactions = [];
  	
    /**
     * Set the transactions to an array of transactions.
     */
    this.setTransactions = function(transactions) {
      this.transactions = transactions;
    }

    /**
     * Set the transactions from CSV, and persist the data
     */
    this.setTransactionDataFromCSV = function(csv) {
      this.setTransactions(convertFromCSV(csv));
    }

    /**
     * Load from peristent storage
     */
    this.load = function() {
      var transactionsStr = LocalStorageService.getData("transactions");
      if (transactionsStr) {
        try {
          this.transactions = angular.fromJson(transactionsStr);
        }
        catch(e) {}
      }
    }

    this.save = function() {
      var transactionsJSON = angular.toJson(this.transactions);
      LocalStorageService.setData("transactions", transactionsJSON);
    }

    function convertFromCSV(dataCSV) {
      var transactions = [];
      var lines = dataCSV.split("\n");

      var categories = $.parseJSON("[" + lines[0] +"]");

      for (var i = 1; i < lines.length; i++) {
          var inRow = $.parseJSON("[" + lines[i] +"]");
          var row = {};
          for (var j = 0; j <categories.length; j++) {
              row[categories[j]] = inRow[j];
          }

          if (row.Category == "")
              continue;

          row.Amount = parseFloat(row.Amount);
          transactions.push(row);
      }
      return transactions;
    }

    /**
     * Generate random transactions for testing
     */
    this.generateRandomData = function() {
      function generateRandomData() {
        var transactions = [];

        function randRange(min, max) {
          return min + Math.random() * (max - min);
        }
        
        function randRangeInt(min, max) {
          return Math.floor(randRange(min, max));
        }
        
        function randString(minLen, maxLen) {
          var len = randRangeInt(minLen, maxLen);
          var chars = "abcdefghhijklmnopqrstuvwxyz  ";
          var result = "";
          while (len--) {
            result += chars[randRangeInt(0, chars.length)];
          }
          return result;
        }
        
        var transactionCategories = ['Mortage', 'Home Improvement', 'Student Loan', 'Groceries', 'Clothing', 'Restaurants', 'Fast Food', 'Gas & Fuel',
          'Car insurance', 'Clipper'];
        var date = new Date();

        for (var i = 0; i < 100; i++) {

          var dateString = (date.getMonth()+1) + "/" + date.getDate() + "/" + (""+date.getFullYear()).substr(2);
          date.setDate(date.getDate() - 1);

          var amount = randRangeInt(100, 1000000) / 100;
          
          var type = (randRange(0,10) > 9) ? "credit" : "debit";

          var category = transactionCategories[randRangeInt(0, transactionCategories.length)];

          var row = {"Date": dateString, "Description": randString(5,20), "Amount":amount, "TransactionType" : type, "Category": category};
          transactions.push(row);
        }
        return transactions;
      }

      var staticDataCSV =
            '"Date","Description","Original Description","Amount","Transaction Type","Category","Account Name","Labels","Notes"\n'+
            '"8/31/2014","Simmer Vietnamese Kitche","SIMMER VIETNAMESE KITCHE","55.17","debit","Restaurants","Blue Cash","",""\n'+
            '"8/31/2014","Raley\'s","RALEYS","34.99","debit","Groceries","Blue Cash","",""\n'+
            '"8/31/2014","Raley\'s","RALEYS","5.70","debit","Groceries","Blue Cash","",""\n'+
            '"8/31/2014","Trader Joe\'s","VISA PURCHASE 315798 TRADER JOE\'S # 107 PETALUMA CA USA94954 2014-08-31 21.55.31","66.86","debit","Groceries","CHECKING ACCOUNT","",""\n'+
            '"8/29/2014","Barrel House Tavern","THE BARREL HOUSE TAVERN","113.93","debit","Clothing","Blue Cash","",""\n';

      this.setTransactions(generateRandomData());
    }
}])

.run(function(TransactionsModel) {
  // automatically load
  TransactionsModel.load();
});
