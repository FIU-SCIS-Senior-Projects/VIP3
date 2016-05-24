(function() {
    angular.module('toDoModule')
    .factory('ToDoService', toDoFactory);

    function toDoFactory ($http) {
        // create a new object
        var toDoFactory = {};

        toDoFactory.loadAllToDo = function () {
            return $http.get('/todo/todo');
        };

        toDoFactory.markAsRead = function (id) {
            return $http.post('/todo/todo/' + id);
        };

        toDoFactory.createTodo = function (todo) {
            return $http.post('todo/todo');
        };

        return toDoFactory;
    }
}());
