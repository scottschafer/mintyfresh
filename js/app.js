var app = angular.module('app', [
  'ui.bootstrap', 'ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'app.services', 'app.models', 'app.controllers', 'ngRoute', 'ngDragDrop'
]);

app.config(function($routeProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'pages/home.html'
		})

		.when('/spending', {
			templateUrl : 'pages/spending.html',
			controller  : 'SpendingController'
		})
		.when('/transactions', {
			templateUrl : 'pages/transactions.html',
			controller  : 'TransactionsController'
		})
		.when('/categories', {
			templateUrl : 'pages/categories.html',
			controller  : 'CategoriesController'
		})
		.when('/budgets', {
			templateUrl : 'pages/budgets.html',
			controller  : 'BudgetsController'
		})
		.when('/import', {
			templateUrl : 'pages/import.html',
			controller  : 'ImportController'
		})
});


angular.module('app.controllers', []);
angular.module('app.services', []);
angular.module('app.models', []);


function formatCurrency(number) {
	return "$" + number.toFixed(0);
}