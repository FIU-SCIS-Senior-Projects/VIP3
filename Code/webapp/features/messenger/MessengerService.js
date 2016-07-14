angular.module('MessengerService', [])

    .factory('MessengerService', function($http) {

        // create a new object
        var projectFactory = {};

        projectFactory.getEmailByName = function (user_id) {
            return $http.get('/api/getemail/'+user_id).then(function(data){
                return data.data;
            });
        };
        
        projectFactory.loadAllUsers = function () {
            return $http.get('/api/getallusers/').then(function(data){
               return data.data;
            });
        };
        
        return projectFactory;
    });