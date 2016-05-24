/**
 * Created by tmoore on 4/5/16.
 */

angular.module('userService', [])

    .factory('User', function($http) {

        // create a new object
        var userFactory = {};

        // create a user
        userFactory.create = function(userData) {
            return $http.post('/vip/users/', userData);
        };

        // get a single user by id
        userFactory.get = function(id) {
            return $http.get('/vip/users/'+ id);
        };

        // get all users
        userFactory.all = function() {
            return $http.get('/vip/users/');
        };

        // update a user
        userFactory.update = function(id, userData) {
            return $http.put('/vip/users/'+ id, userData);
        };

        // delete a user
        userFactory.delete = function(id) {
            return $http.delete('/vip/users/' + id);
        };

        // Verify a users email address
        userFactory.verifyEmail = function(id, userData) {
            return $http.put('/vip/verifyEmail/' + id, userData);
        };
        //Emails to userData.email, with subject userData.subject, with text userData.text
        userFactory.nodeEmail = function(userData){
            return $http.post('/vip/nodeemail/', userData);
        };

        // return our entire userFactory object

        return userFactory;


    });
