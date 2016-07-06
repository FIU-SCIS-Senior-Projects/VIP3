angular.module('admin')
    .factory('adminService', adminService);

function adminService($http) {
    // create a new object
    var adminFactory = {};

        adminFactory.loadProfile = function () {
            return $http.get('/api/reviewuser/').then(function(data){
               return data.data;
            });
        };

        return adminFactory;
    }
