/*
 * The original version...needs a rework
 */

angular.module('app.controllers').
  controller('SpendingController', ["$scope", function($scope) {

  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  $scope.transactions = DataService.transactions;
  $scope.budgetsArray = DataService.budgetsArray;
  $scope.categoryToBudgets = DataService.categoryToBudgets;

  $scope.visibleTransactions = [];
  
  $scope.$watch(function() { return DataService.transactionRefreshCount; },
    function() { $scope.refreshTable() } );

  $scope.$watch(function() { return DataService.budgetsArray; },
    function() { $scope.refreshTable() } );

  $scope.$watch('selectedRange', function () {
    $scope.buildSpendingReport();

    $scope.visibleTransactions = [];
  });

  function filterTransactions(transactions, from, to) {
    var result = [];
    for (var i = 0; i < transactions.length; i++) {
      var transaction = transactions[i];
      var date = new Date(transaction.Date).getTime();
      if (date >= from && date <= to) {
        result.push(transaction);
      }
    }
    return result;
  }

  $scope.buildSpendingReport = function() {

    function generateBar(spent, budget) {
      var parentPercent = 100;
      var barPercent = 100 * spent / budget;
      var barColor = "green";

      if (spent > budget) {
        parentPercent = 100 * budget / spent;
        barPercent = 10000 / parentPercent;
        barColor = "red";
      }
      var result =  
       '<div style="height: 20px;bottom: -30px;border: black;border-width: 1px; float:initial;border-style: solid;width:' + parentPercent +
        '%;background-color: white;">' +
        '<div style="opacity:.7;height: 14px; border: black;border-width: 1px;float: initial;border-style: none;width:' + barPercent + '%;background-color:' +
        barColor + ';margin: 2px;"></div></div>';

      console.log(result);
      return result;
    }

    var allTransactions = filterTransactions($scope.transactions, $scope.selectedRange.range.from, $scope.selectedRange.range.to);

    var report = {};

    for (var i = 0; i < allTransactions.length; i++) {
      var transaction = allTransactions[i];
      var category = transaction.Category;
      var budgetName = $scope.categoryToBudgets[category];
      if (budgetName == "[None]") {
        continue;
      }
      if (budgetName == null || budgetName == undefined || budgetName == "") {
        budgetName = "Other";
      }

      if (! report.hasOwnProperty(budgetName)) {
        report[budgetName] = {allTransactions:[], byCategory:{}, categoryTotal:{}, categories:[]};
      }
      if (! report[budgetName].byCategory.hasOwnProperty(category)) {
        report[budgetName].byCategory[category] = [];
        report[budgetName].categoryTotal[category] = 0;
        report[budgetName].categories.push(category);
      }
      report[budgetName].byCategory[category].push(transaction);
      report[budgetName].categoryTotal[category] += parseFloat(transaction.Amount);
      report[budgetName].allTransactions.push(transaction);
    }

    $scope.spendingReport = report;
    $scope.spendingTransactions = [];

    var spendingHtml = "";
    var sortedBudgets = DataService.getSortedBudgets();

    for (var iBudget in sortedBudgets) {
      var budgetName = sortedBudgets[iBudget];
      if (budgetName == "[None]") {
        continue;
      }
      var budgetReport = report[budgetName];
      if (! budgetReport) {
        budgetReport = {allTransactions:[], byCategory:{}, categoryTotal:{}, categories:[]};
      }
      var budget = DataService.getBudgetFromName(budgetName);
      
      budgetReport.categories.sort(function(a,b) {
        return budgetReport.categoryTotal[b] - budgetReport.categoryTotal[a];
      });

      spendingHtml += "<div class='spendingColumn'>";

      var iTransactions = $scope.spendingTransactions.length;
      $scope.spendingTransactions.push(budgetReport.allTransactions);

      spendingHtml += "<div class='budgetHeader selectableSpending' data-iTransactions='" + iTransactions + "'>";
      spendingHtml += "<h1>" + budgetName + "</h1>";
      var total = 0;
      for (var i = 0; i < budgetReport.allTransactions.length; i++) {
        total += budgetReport.allTransactions[i].Amount;
      }
      spendingHtml += "<h2>" + formatCurrency(total) + " of " + formatCurrency(budget.Amount) + "</h2>";

      spendingHtml += generateBar(total, budget.Amount);
      spendingHtml += "</div>";
      

      for (var j = 0; j < budgetReport.categories.length; j++) {
        var categoryInBudget = budgetReport.categories[j];
        iTransactions = $scope.spendingTransactions.length;
        var transactions = budgetReport.byCategory[categoryInBudget];
        $scope.spendingTransactions.push(transactions);
        spendingHtml += "<div class='budgetCategory selectableSpending' data-iTransactions='" + iTransactions + "'>";
        spendingHtml += "<h2>" + categoryInBudget + " (" + transactions.length + ") ";
        total = 0;
        for (var i = 0; i < transactions.length; i++) {
          total += transactions[i].Amount;
        }
        spendingHtml += "<span style='float:right'>" + formatCurrency(total) + "</span></h2>";
        spendingHtml += "</div>";
      }
      spendingHtml += "</div>";
    }

    $(".spending").html(spendingHtml);
    $(".spending").find(".selectableSpending").each(function(iSelectable, selectable) {
      var iTransaction = $(selectable).attr("data-iTransactions");
      $(selectable).click(function() {
        $(".spending").find(".selectableSpending").removeClass("selected");
        $(selectable).addClass("selected");
        $scope.visibleTransactions = $scope.spendingTransactions[iTransaction];
        console.log("visible transactions #" + iTransaction);
        $scope.$apply();
      });

    });
  }


  /**
   * Initialize date ranges
   */
  $scope.dateRanges = [];
  var from = new Date();
  from.setDate(1);
  from.setHours(0,0,0,0);
  var to = new Date();
  to.setHours(23,59,59,999);

  $scope.dateRanges.push({name:("Current month ("+months[from.getMonth()] + ")"), range:{from:from.getTime(), to:to.getTime()}});
  $scope.selectedRange =  $scope.dateRanges[0];

  var month = from.getMonth();
  var year = from.getFullYear();

  for (var i = 0; i < 24; i++) {
    to = new Date();
    from = new Date();

    to.setFullYear(year);
    to.setMonth(month);
    to.setDate(0);
    to.setHours(23,59,59,999);

    from.setFullYear(year);
    from.setMonth(month-1);
    from.setDate(1);
    from.setHours(0,0,0,0);

    --month;

    $scope.dateRanges.push({name:(months[from.getMonth()] + " " + from.getFullYear()), range:{from:from,to:to}});
  }

    $scope.refreshTable = function(refreshColumns) {
      $scope.transactions = DataService.transactions;
      $scope.budgetsArray = DataService.budgetsArray;
      $scope.categoryToBudgets = DataService.categoryToBudgets;
      $scope.buildSpendingReport();
    }
    //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    

  $scope.gridOptions = {
    data: 'visibleTransactions',
    /*columnDefs: [] */
        enablePaging: false,
        enableCellSelection: true,
        filterOptions: $scope.filterOptions,
        columnDefs: [   {field:'Date', displayName:'Date'},
                        {field:'Description', displayName:'Description'},
                        {field:'Category', displayName:'Category'},
                        {field:'Amount', displayName:'Amount'}
                    ]
    };

}]);