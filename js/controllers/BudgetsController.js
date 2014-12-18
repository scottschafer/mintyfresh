angular.module('app.controllers').
  controller('BudgetsController', ["$scope", "BudgetsModel", function($scope, BudgetsModel) {

    $scope.budgets = BudgetsModel.budgets;
    $scope.budgetCategories = [];

    // refresh the drag and droppable categories
    $scope.$watch("budgets.categoryToBudgetsMapping", function(newVal, oldVal) {
      var budgetCategories = [];
      
      for (var category in newVal) {
        var budgetIndex = newVal[category];
        if (budgetIndex >= $scope.budgetCategories.length) {
          budgetCategories.push([]);          
        }
        budgetCategories[budgetIndex].push({'title': category, 'drag': true});
      }

      for (var i = 0; i < budgetCategories.length; i++) {
        budgetCategories[i].sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0) });
      }

      $scope.budgetCategories = budgetCategories;
    });

   // Limit items to be dropped
    $scope.optionsList = {
      accept: function(dragEl) {
        return true;
      }
    };
 }])

// a budget column
.directive('budget', function() {
  return {
    restrict: 'E',
    scope: {
        value: "=",
        categories: "="

    },
    template:
    '<div>'+          
      '<input class="budgetInput" type="text" name="name" value="{{value.name}}"><br> '+
      '<span class="budgetLabel">Amount: $</span><input class="budgetInput" type="number" name="amount" value="{{value.amount}}"><br>' +
      '<label class="small"><input type="checkbox" name="show" label="show" ng-checked="{{value.show}}"> Show in spending</label><br>' +
      '<budget-categories categories="categories"></budget-categories>' +
    '</div>',
    replace: true
  }
})
// the draggable list of categories in a budget column
.directive('budgetCategories', function() {
  return {
    restrict: 'E',
    scope: {
        categories: "="
    },
    template:

      '<div class="budgetCategories" data-drop="true" ng-model=\'categories\' data-jqyoui-options="optionsList" jqyoui-droppable="{multiple:true}">' +
        '<div class="categoryInBudget btn btn-info btn-draggable" ng-repeat="item in categories" ng-show="item.title" data-drag="{{item.drag}}" data-jqyoui-options="{revert: \'invalid\'}" ng-model="categories" jqyoui-draggable="{index: {{$index}},animate:true}">{{item.title}}</div>' +
        '</div>' + 
    '</div>',
    replace: true
  }
});
