angular.module('ProjectProposalController', ['ProjectProposalService'])
    .controller('ProjectProposalController', function($scope, ProjectService, $stateParams){

		function getCookie(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i = 0; i <ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length,c.length);
				}
			}
			return "";
		}

		function checkCookie(cookieName)
		{
			var username=getCookie(cookieName);
			if (username!="") {
				return true;
			} else {
				return false;
				}
		}

		// if the user isnt logged in, redirect them to the login page
		if (getCookie("isLoggedIn") != "1" || !checkCookie("isLoggedIn"))
		{
			// save the current page that is redirecting them, so we can come back here later, after they login
			document.cookie = "destinationURL="+window.location;

			window.location = "/#/login";
		}

        $scope.colleges= [
            {
                name: 'Architecture & The Arts',
                schools: [
                    'Architecture',
                    'Interior Architecture',
                    'Landscape Architecture and Environmental Urban Design',
                    'Art and Art History',
                    'Communication Arts',
                    'School of Music',
                    'Theatre']
            },
            {
                name: 'Arts and Sciences & Education',
                schools: [
                    'Biological Sciences',
                    'Chemistry and Biochemistry',
                    'Earth and Environment',
                    'English',
                    'Mathematics and Statistics',
                    'Philosophy',
                    'Physics',
                    'Psychology',
                    'Teaching and Learning',
                    'Leadership and Professional Studies',
                    'School of Education',
                    'School of Enviroment, Arts & Society',
                    'School of Integrated Science & Humanity'
                ]
            },
            {
                name: 'Business',
                schools: [
                    'Decision Sciences and Information Systems',
                    'Alvah H. Chapman Jr. Graduate School of Business',
                    'R. Kirk Landon Undergraduate School of Business',
                    'Finance',
                    'Management and International Business',
                    'Marketing',
                    'School of Accounting',
                    'Real Estate'
                ]
            },
            {
                name: 'Chaplin School of Hospitality and Tourism Management',
                schools: [
                    'Hospitality and Tourism Management'
                ]
            },
            {
                name: 'Engineering & Computing',
                schools: [
                    'School of Computing and Information Sciences',
                    'OHL School of Construction',
                    'Department of Biomedical Engineering',
                    'Department of Civil and Environment Engineering',
                    'Department of Electrical and Computer Engineering',
                    'Department of Mechanical and Materials Engineering'
                ]
            },
            {
                name: 'Herbert Wertheim College of Medicine',
                schools: [
                    'Cellular Biology and Pharmacology',
                    'Human and Molecular Genetics',
                    'Immunology',
                    'Medical and Population Health Sciences Research'
                ]
            },
            {
                name: 'Journalism and Mass Communication',
                schools: [
                    'Advertising and Public Relations',
                    'Journalism Broadcasting and Digital Media'
                ]
            },
            {
                name: 'Law',
                schools: [
                    'College of Law'
                ]
            },
            {
                name: 'Nicole Wertheim College of Nursing & Health Sciences',
                schools: [
                    'Biostatistics',
                    'Dietetics and Nutrition',
                    'Environmental and Occupational Health',
                    'Epidemiology',
                    'Health Policy and Management',
                    'Health Promotion and Disease Prevention'
                ]
            },
            {
                name: 'Robert Stempel College of Public Health & Social Work',
                schools: [
                    'School of Social Work'
                ]
            },
            {
                name: 'Steven J. Green School of International and Public Affairs',
                schools: [
                    'Criminal Justice',
                    'Economics',
                    'Global and Sociocultural Studies',
                    'History',
                    'Modern Languages',
                    'Public Administration',
                    'Religious Studies'
                ]
            }
        ];

        $scope.fixedColleges = $scope.colleges;

        for(school in $scope.fixedColleges){
            var name = $scope.fixedColleges[school]['name']
            var fixedNames = name.split(' ').join('_');
            fixedNames = fixedNames.split('&').join('and');
            console.log(fixedNames);
            $scope.fixedColleges[school]['name'] = fixedNames;
        };

        var vm = this;
        vm.title = "";
        vm.image = ""
        vm.description = "";
        vm.disciplines = [];
        vm.editingMode = false;
        //$scope.project.submit = submit;

        init();
        function init () {
            if($stateParams.id != null){
				loadData();
                vm.id = $stateParams.id;
                vm.editingMode = true;
                getProjectById();
            }
        }

        function loadData(){
            reviewProfileService.getReg($state.params.user_id).then(function(data){
                vm.profile = data;

            });
        }

        function getProjectById (){
            ProjectService.getProject(vm.id).then(function(data){
                $scope.project = data;
            });
        }

        $scope.save = function save() {

			var f = document.getElementById('teamImage').files[0],
			r = new FileReader();
			r.onloadend = function(e){
				var dataURL = e.target.result;

				$scope.project.image = dataURL;
			    if(!vm.editingMode){
						$scope.project.status='pending'
						ProjectService.createProject($scope.project)
							.then(function(data){
								$scope.result = "Project Proposal Submitted and Pending!";
							}, function (error) {
								$scope.result = "An Error Occured Whilst Submitting Project Proposal! REASON: " + error.data;
							});
			    }
			    else{
						$scope.project.id = $stateParams.id
						ProjectService.editProject($scope.project, $stateParams.id)
							.then(function(data){
								$scope.result = "Project Proposal Submitted and Pending!";
							}, function(error) {
								$.scope.result = "An Error Occured Whilst Submitting Project Proposal!";
							});
				}

			}
			r.readAsDataURL(f);



        };

        $scope.toggleCheckbox = function toggleSelection(majors) {
            var idx = vm.disciplines.indexOf(majors);

            // is currently selected
            if (idx > -1) {
              vm.disciplines.splice(idx, 1);
            }

            // is newly selected
            else {
              vm.disciplines.push(majors);
            }
        };
    });