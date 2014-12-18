angular.module('app.controllers').
  controller('CategoriesController', ["$scope", "$rootScope", "CategoryRemappingModel", function($scope, $rootScope, CategoryRemappingModel) {

    $scope.CategoryRemappingModel = CategoryRemappingModel;

    this.mintCategories = [{id:1, value:'test'}];

    // categoryRemapping is a simple associative array, but that won't work for editing, so convert it to a format
    // plays well with ui-grid
    $scope.$watch('CategoryRemappingModel.categoryRemapping', function (newVal, oldVal, scope) {
      var mintCategories = [];
      var categoryRemappingArray = [];

      if(newVal) { 
        var existingCategoriesToIndex = {};

        // pass #1, add entries for all categories
        var id = 1;
        for (var fromCategory in newVal) {
          mintCategories.push({ id: id, value: fromCategory });
          existingCategoriesToIndex[fromCategory] = id;
          ++id;
        }

        // pass #2, create categoryRemappingArray
        for (var fromCategory in newVal) {
          var toCategory = newVal[fromCategory];
          categoryRemappingArray.push({ old: fromCategory, new: existingCategoriesToIndex[toCategory] });
        }
      }

      // I'd love to avoid polluting the $rootScope, but the filter needs this data...
      $rootScope.mintCategories = mintCategories;

      // update the new category popdown list
      newCategoryDef.editDropdownOptionsArray = mintCategories;

      // update the list data
      $scope.categoryRemappingArray = categoryRemappingArray;

    });
  
    var oldCategoryDef = { name: 'old', displayName: 'Category', enableCellEdit: false };

    var newCategoryDef = { name: 'new', displayName: 'Recategorize as...', enableCellEdit: true, enableCellEditOnFocus: true,
          editableCellTemplate: 'ui-grid/dropdownEditor', 
          cellFilter: 'mapCategory',
          editDropdownOptionsArray: this.mintCategories,
          enableCellEditOnFocus: true };

    $scope.gridOptions = {
      data: "categoryRemappingArray",
      enableRowSelection: false,
      enableCellEdit: true,
      multiSelect: false, 
      columnDefs: [ oldCategoryDef, newCategoryDef ],
      onRegisterApi: function(gridApi){
          //set gridApi on scope
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue) {
            $scope.CategoryRemappingModel.setCategoryMapping($rootScope.mintCategories[oldValue-1].value, $rootScope.mintCategories[newValue-1].value);
            $scope.$apply();
          });
        }
    };

}])


.filter('mapCategory', function($rootScope) {
  return function(input) {
    if (!input){
      return '';
    }

    if ($.isNumeric(input)) {
      var i = parseInt(input);
      if (i > 0 && i <= $rootScope.mintCategories.length) {
        return $rootScope.mintCategories[i-1].value;
      }
    }

    return input;
  }
});