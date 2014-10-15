/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
        .factory('Todo', function ($resource) {
          return $resource('/todos/:id', null,
                           {
                             'update': { method:'PUT' }
                           });
        })
	.config(function ($routeProvider) {
		'use strict';

		$routeProvider.when('/', {
			controller: 'TodoCtrl',
			templateUrl: 'todomvc-index.html'
		}).when('/:status', {
			controller: 'TodoCtrl',
			templateUrl: 'todomvc-index.html'
		}).otherwise({
			redirectTo: '/'
		});
	});
