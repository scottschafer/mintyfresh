angular.module('app.controllers').
  controller('ImportController', ["$scope", "TransactionsModel", function($scope, TransactionsModel) {

    $scope.onUpload = function(f) {
      var reader = new FileReader();

      reader.onerror = function(e) {
        alert("couldn't load, " + e.toString());
      }
      reader.onload = function(e) {
        var text = reader.result;
        TransactionsModel.setTransactionDataFromCSV(text);
        TransactionsModel.save();

        // TODO: something better than an alert ;)
        alert("Transactions loaded - view under the Transactions or Spending tabs");
      }

      try {
        reader.readAsText(f.files[0]);
      }
      catch(e) {
        console.log(e.toString());
      }
    }

    $scope.onGenerateRandomData = function() {
     TransactionsModel.generateRandomData();
     TransactionsModel.save();
        alert("Random transactions generated - view under the Transactions or Spending tabs");
    }
 }]);
