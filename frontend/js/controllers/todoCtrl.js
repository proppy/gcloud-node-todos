/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, todoStorage, Todo) {
		'use strict';

		var todos = $scope.todos = Todo.query();

		$scope.newTodo = '';
		$scope.editedTodo = null;

		$scope.$watch('todos', function (newValue, oldValue) {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';

			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : null;
		});

		$scope.addTodo = function () {
			var newTodo = $scope.newTodo.trim();
			if (!newTodo.length) {
				return;
			}

                        var todo = new Todo();
                        todo.title = newTodo;
                        todo.completed = false;
                        todo.$save(function(data) {
			  todos.push(data);
                        });

			$scope.newTodo = '';
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.doneEditing = function (todo) {
			$scope.editedTodo = null;
			todo.title = todo.title.trim();


			if (!todo.title) {
				$scope.removeTodo(todo);
			} else {
                                // TODO: `doneEditing` will be triggered twice (by 'onblur' and 'keyup') when validating with enter.
                                Todo.update({id: todo.id}, todo);
                        }
		};

                $scope.changeTodo = function (todo) {
                        Todo.update({id: todo.id}, todo);
                };

		$scope.revertEditing = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.doneEditing($scope.originalTodo);
		};

		$scope.removeTodo = function (todo) {
                        Todo.remove({id: todo.id}, function() {
			  todos.splice(todos.indexOf(todo), 1);
                        });
		};

		$scope.clearCompletedTodos = function () {
                        Todo.remove(function() {
                          Todo.query(function(todos) {
                            $scope.todos = todos;
                          });
                        });
		};

		$scope.markAll = function (completed) {
                  // TODO: update the todo only when the REST operation is completed.
		  todo.completed = !completed;
		  todos.forEach(function (todo) {
                    // TODO: implement batch
                    Todo.update({id: todo.id}, todo, function() {
                      // TODO: give user feedback about the progress of the operation.
                    });
		  });
		};
	});
