/*
 *	The budgets model, including mapping categories into budgets
*/
angular.module('app.models').
  service('BudgetsModel', ['$rootScope', 'CategoryRemappingModel', 'LocalStorageService', function($rootScope, CategoryRemappingModel, LocalStorageService) {
    
    this.budgets = {
      buckets: [
        // editable, just put something to get it started for now.
        { 'name': 'Other', 'amount': 10000, 'show': true },
        { 'name': 'Fixed', 'amount': 100, 'show': false },
        { 'name': 'Food', 'amount': 200, 'show': true },
        { 'name': 'Housing', 'amount': 300, 'show': true },
        { 'name': 'Something', 'amount': 400, 'show': true}
      ],

    // map of category names to budget indices
      categoryToBudgetsMapping: {}
    };

    this.load = function() {
      var budgetsStr = LocalStorageService.getData("budgets");
      if (budgetsStr) {
        this.budgets = angular.fromJson(budgetsStr);
      }
    }

    this.save = function() {      
      var budgetsStr = angular.toson(this.budgets);
      LocalStorageService.setData("budgets", budgetsStr);
    }

    var self = this;

    /**
     * refresh the mappings of categories to bucket indices, adding any unknown categories to the first bucket (aka "other")
     */
    this.refreshCategoryToBudgetsMapping = function() {
      var categoryRemapping = CategoryRemappingModel.categoryRemapping;
      var categoryToBudgetsMapping = {};

      for (var mintCategory in categoryRemapping) {
        var category = categoryRemapping[mintCategory];
        if (self.budgets.categoryToBudgetsMapping.hasOwnProperty(category)) {
          categoryToBudgetsMapping[category] = self.budgets.categoryToBudgetsMapping[category];
        }
        else {
          categoryToBudgetsMapping[category] = 0; // default bucket for a category is other
        }
      }

      self.budgets.categoryToBudgetsMapping = categoryToBudgetsMapping;
    }

    // when the list of remapped categories change, update the category -> budget mapping
    $rootScope.$watch("CategoryRemappingModel.categoryRemapping", this.refreshCategoryToBudgetsMapping);
}])

.run(function(BudgetsModel) {
  // auto-load
  BudgetsModel.load();
});
