angular.module('reviewRegistration')
    .factory('reviewRegService', userService);

function userService($http) {
    // create a new object
    var profileFactory = {};


    profileFactory.getReg = function (user_id) {
        return $http.get('/api/verifyuser/'+user_id).then(function(data){
            return data.data;
        });
    };

    profileFactory.acceptProfile = function (profileData) {
        return $http.put('/api/profile/',profileData).then(function(data){
            return data.data;
        });
    };
    profileFactory.rejectProfile = function (profileData) {
        return $http.put('/api/profile/',profileData).then(function(data){
            return data.data;
        });
    };

    return profileFactory;
}
