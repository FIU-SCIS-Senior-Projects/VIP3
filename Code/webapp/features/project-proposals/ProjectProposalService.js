angular.module('ProjectProposalService', [])

    .factory('ProjectService', function($http) {

        // create a new object
        var projectFactory = {};

        projectFactory.createProject = function (projectData) {
            return $http.post('/api/projects', projectData)
        };

        projectFactory.editProject = function (projectData, id) {
            return $http.put('/api/projects/' + id, projectData);
        };
        
        projectFactory.getProjects = function () {
            return $http.get('/api/projects/').then(function(data){
               console.log("Got the Projects");
               return data.data; 
            });
        };

        projectFactory.getProject = function (id) {
            return $http.get('/api/projects/'+ id).then(function(data){
               console.log("Got the Project");
               return data.data; 
            });
        };

        projectFactory.delete = function (id) {
            return $http.delete('/api/projects/' + id).then(function(data){
               console.log("Deleting response just arrived");
            });;
        };
        return projectFactory;
    });
