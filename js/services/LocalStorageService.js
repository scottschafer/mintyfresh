/**
 * A service that provides access to local data persistence
 */
angular.module('app.services').
  service("LocalStorageService", ["$window", function($window) {
	  return {
	    setData: function(key, val) {
	      $window.localStorage && $window.localStorage.setItem(key, val);
	      return this;
	    },
	    getData: function(key) {
	      return $window.localStorage && $window.localStorage.getItem(key);
	    }
	  }
	}
  ]);
