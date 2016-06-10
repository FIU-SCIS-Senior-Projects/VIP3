angular.module('reviewProfile')
    .factory('reviewProfileService', userNewService);

function userNewService($http) {
    // create a new object
    var profileFactory = {};


    profileFactory.getReg = function (user_id) {
        return $http.get('/api/verifyuser/'+user_id).then(function(data){
            return data.data;
        });
    };

    profileFactory.acceptProfile = function (profileData) {
        return $http.put('/api/updateprofile/',profileData).then(function(data){
            return data.data;
        });
    };
    profileFactory.rejectProfile = function (profileData) {
        //return $http.put('/api/updateprofile/',profileData).then(function(data){
            //return data.data;

            // do nothing....right??

        //});
    };

    return profileFactory;
}
