/*
 *	The model of category remapping (e.g., Fast Food -> Restaurants)
*/
angular.module('app.models').
  service('CategoryRemappingModel', ['$rootScope', 'TransactionsModel', 'LocalStorageService', function($rootScope, TransactionsModel, LocalStorageService) {

    $rootScope.CategoryRemappingModel = this;

    /**
     * category remapping associative array
     */
    this.categoryRemapping = {};

    this.save = function() {
      var saveVal = angular.toJson(this.categoryRemapping);
      LocalStorageService.setData("categoryMapping", saveVal);
    }

    this.load = function() {
      var categoryMappingJSON = LocalStorageService.getData("categoryMapping");
      if (categoryMappingJSON) {
        try {
          this.categoryRemapping = angular.fromJson(categoryMappingJSON);
        }
        catch(e) {}
      }
    }

    this.setCategoryMapping = function(oldCategory, newCategory) {
      if (this.categoryRemapping[oldCategory] != newCategory) {
        var newMapping = $.extend({}, this.categoryRemapping);
        newMapping[oldCategory] = newCategory;
        this.categoryRemapping = newMapping;
        this.save();
      }
    }

     /**
     * When the list of transactions change, import all the new categories (adding the default of x -> x, meaning no remapping)
     */
    var self = this;
    this.refreshCategoriesFromTransactions = function() {

      var newMintCategories = [];
      var newCategoryRemappingArray = [];
      var newCategoryRemapping = {};

      var transactions = TransactionsModel.transactions;

      for (var i = 0; i < transactions.length; i++) {
        var category = transactions[i].Category;

        if (! newCategoryRemapping.hasOwnProperty(category)) {
          if (self.categoryRemapping.hasOwnProperty(category)) {
            // if an existing category mapping existed, use that
            newCategoryRemapping[category] = self.categoryRemapping[category];
          }
          else {
            newCategoryRemapping[category] = category;
          }
        }
      }

      self.categoryRemapping = newCategoryRemapping;
    }

    $rootScope.$watch("TransactionsModel.transactions", this.refreshCategoriesFromTransactions);
}])

.run(function(CategoryRemappingModel) {
  CategoryRemappingModel.load();
});
