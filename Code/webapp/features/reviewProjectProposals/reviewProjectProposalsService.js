angular.module('reviewProjectProposals')
    .factory('reviewPPS', projectService);

function projectService($http) {
    // create a new object
    var projectFactory = {};


    projectFactory.loadProjects = function () {
        return $http.get('/api/reviewproject').then(function(data){
            return data.data;
        });
    };
	
	 projectFactory.AcceptProjects = function (id) {
        return $http.put('/api/reviewproject/'+ id).then(function(data){
			return data.data;
        });
    };
        
	projectFactory.RejectProjects = function (id) {
        return $http.delete('/api/reviewproject/'+ id).then(function(data){
            console.log("Deleting response just arrived");
        });;
    };	
	
	projectFactory.UndoActiveProject = function (pid, proj) {
		return $http.put('/api/reviewproject/'+ pid + '/' + proj).then(function(data){
			return data.data;
        });
    };
	
    projectFactory.createLog = function (log) {
            return $http.post('/log/log', log);
    };
	
	projectFactory.loadLog = function (type) {
			return $http.get('/log/log/' + type).then(function(data){
				return data.data;
	  });
	}
	projectFactory.UndoLog = function (id) {
			return $http.delete('/log/log/' + id).then(function(data){
               console.log("Deleting response just arrived");
            });;
        };

    return projectFactory;
}
