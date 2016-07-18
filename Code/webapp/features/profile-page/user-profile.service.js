angular.module('user-profile')
    .factory('ProfileService', userService);

    function userService($http) {
        // create a new object
        var profileFactory = {};

        // profileFactory.loadProfile = function (email) {
        //     return $http.get('/api/profile/' + email).then(function(data){
        //        //console.log("Got the Projects");
        //        return data.data;
        //     });
        // };
        profileFactory.loadProfile = function () {
            return $http.get('/api/profile/').then(function(data){
               return data.data[0];
            }, function(error) {
				return null;
			});
        };

        profileFactory.saveProfile = function (profileData) {
            return $http.put('/api/profile/',profileData).then(function(data){
               return data.data;
            });
        };

		// function will store the newly requested "Rank" and "Role" values into a temp variable in the DB.
		// PI will recieve an email asking him/her to approve this new status for the user
		// if approved, the current users rank will be replaced with the temp value, and temp value will be purged from DB
		// if rejected, current rank will remain as it is, and temp value will be purged from DB
        profileFactory.requestProfileUpdate = function (profileData) {
            return $http.put('/api/profile/',profileData).then(function(data){
               return data.data;
            });
        };

        return profileFactory;
    }
