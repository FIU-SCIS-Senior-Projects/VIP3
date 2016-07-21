angular.module('mainApp', [
	'textAngular',
	'vipHeader',
	'vipFooter',
    'vip-projects',		//Features Module
	'ProjectProposalController',
	'reviewProfile',
	'routes',
	'projectApplicationController',
	'userRegistrationController',
	'forgotPasswordController',
	'forgotPasswordService',
	'contactController',
	'userService',
    'toDoModule',
	'user-profile',
	'reviewRegistration',
	'folder',
	'reviewStudentApp',
	'reviewProjectProposals',
	'admin',
    'MessengerController'
]).filter('selectedTags', function() {
    return function(users, members)
    {
         if (users && members)
         {
             for(i = 0; i < users.length; i++) 
             {
                 //alert("i see " + users[i].email);
                 //alert("comparing " + users[i].email);
                 if (!members.includes(users[i].email))
                 {
                    //alert("found " + users[i].email);
                    users.splice(i,1);
                 }
             }
             return users;
         }
    };
});
