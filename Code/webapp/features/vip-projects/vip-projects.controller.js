(function () {
    'use strict';

    angular
        .module('vip-projects')
        .controller('VIPProjectsCtrl', VIPProjectsCtrl);

    VIPProjectsCtrl.$inject = ['$state', '$scope', 'ProjectService'];
    /* @ngInject */
    function VIPProjectsCtrl($state, $scope, ProjectService) {
        //Variable Declarations
        var vm = this;
        vm.projects;
        vm.disciplines;
        vm.backupProjects;
        vm.backupDisciplines;
        vm.temProj = new Set();
        vm.filteringVariables = new Set();
        vm.showAllCheckBox = true;

        //Function Declarations
        vm.showAllDisciplinesToggle = showAllDisciplinesToggle; 
        vm.filterByDiscipline = filterByDiscipline;
        vm.viewDetails = viewDetails; 
        
        init();
        function init(){
            loadData();
        }
        
        function checkBoxChange () {
            if(vm.filteringVariables.size > 0)
                document.getElementById("showAll").indeterminate = true;
            else
                document.getElementById("showAll").indeterminate = false;
        }
        
        function loadData(){
            ProjectService.getProjects().then(function(data){
                bubbleSort(data, 'title');
                vm.disciplines = getDisciplines(data);
                vm.projects = data;
                vm.backupProjects = vm.projects;
                vm.backupDisciplines = vm.disciplines;
            });
        }
        
        function showAllDisciplinesToggle() {
            if(vm.showAllCheckBox){
                vm.projects = vm.backupProjects;
                vm.disciplines = getDisciplines(vm.backupProjects);
            }else {
                vm.projects = [];
                vm.disciplines = [];
            }
            vm.filteringVariables.clear();
        }
        
        function filterByDiscipline (discipline) {
            vm.temProj.clear();
            if(discipline != null) {
                /*
                * Find if discipline already being displayed, in which case it will be discarded as a filtering option.
                * and the remaining filters have to be reapplied to all the projects. NEEDS REVISION for IMPROVEMENT
                */
                if(vm.filteringVariables.has(discipline)){
                    vm.filteringVariables.delete(discipline);
                    filterProjects(vm.filteringVariables, vm.backupProjects);
                }
                else{
                    var disciplineSet = new Set();
                    disciplineSet.add(discipline);
                    vm.filteringVariables.add(discipline);
                    filterProjects(disciplineSet, vm.projects);
                }
                checkBoxChange();
            }
        } 
        
        function viewDetails (data) {
            $state.go('projectsDetailed',{id: data._id});
        }
        
        function bubbleSort(a, par)
        {
            var swapped;
            do {
                swapped = false;
                if(par != null && par != ''){
                    for (var i = 0; i < a.length - 1; i++) {
                        if (a[i][par] > a[i + 1][par]) {
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            swapped = true;
                        }
                    }
                }
                else {
                    for (var i = 0; i < a.length - 1; i++) {
                        if (a[i] > a[i + 1]) {
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            swapped = true;
                        }
                    }
                }
            } while (swapped);
        }
        
        function getDisciplines(projects) {
            var disciplines = new Set();
            var tempArray = [];
            angular.forEach(projects, function(value){
                angular.forEach(value.disciplines, function(discipline){
                    var obj = {title:discipline};
                    disciplines.add(discipline);
                })
            })
            disciplines.forEach(function(obj){
                tempArray.push(obj);
            })
            bubbleSort(tempArray,null);
            return tempArray;
        }
        
        function filterProjects(discipline, projects){
            var tempArray = [];
            discipline.forEach(function (obj){
                tempArray.push(obj);
            })
            angular.forEach(tempArray, function(obj) {
                angular.forEach(projects, function(item){
                    angular.forEach(item.disciplines, function(itemDiscipline){
                        if(itemDiscipline === obj)
                        {
                            vm.temProj.add(item);
                        }    
                    })
                })
                projects = [];
                vm.temProj.forEach(function (proj) {
                    projects.push(proj);
                });    
                vm.temProj.clear();
            })
            
            vm.projects = [];
            angular.copy(projects, vm.projects);
            bubbleSort(vm.projects, 'title');
            vm.disciplines = getDisciplines(vm.projects);
        }
    }
})();

