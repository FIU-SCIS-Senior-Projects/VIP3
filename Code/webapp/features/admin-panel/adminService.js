angular.module('admin')
    .factory('adminService', adminService);

function adminService($http) {
    // create a new object
    var adminFactory = {};
		
        adminFactory.loadAllUsers = function () {
            return $http.get('/api/getallusers/').then(function(data){
               return data.data;
            });
        };

        return adminFactory;
    }
