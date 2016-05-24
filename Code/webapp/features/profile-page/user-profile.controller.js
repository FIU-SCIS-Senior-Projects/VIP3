(function () {
    'use strict';

    angular
        .module('user-profile')
        .controller('profileController', profileController);

    profileController.$inject = ['$state', '$scope', 'ProfileService'];
    /* @ngInject */
    function profileController($state, $scope, ProfileService) {
        var vm = this;
        vm.profile;
		vm.updateProfile = updateProfile;
        
        init();
        function init(){
            loadData();
        }
        
        function loadData(){
            ProfileService.loadProfile().then(function(data){
                vm.profile = data;
            });
        }
		
		function updateProfile () {
			ProfileService.saveProfile(vm.profile).then(function(data){
                console.log("Profile Updated");
            });
		}


		vm.users = ["Student",
			"Staff/Faculty",
			"Pi/CoPi",
			"Student"
		];

		vm.ranks = [
			'Freshman',
			'Sophmore',
			'Junior',
			'Senior',
			'Masters',
			'PhD',
			'postDoc',
			'PI',
			'CoPI',
			'Coordinator',
			'External Member',
			'Administrator',
			'Director',
			'Instructor',
			'Assitant Professor',
			'Associate Professor',
			'Full Professor'
		];


        vm.majors = [
			"Accounting",
			"Adult Education and Human Resource Development",
			"Advertising (Communication)",
			"African and African Diaspora Studies",
			"Anthropology/Sociology",
			"Applied Mathematics",
			"Architecture",
			"Art",
			"Art History",
			"Art Education",
			"Asian Studies",
			"Athletic Training",
			"Basic Biomedical Sciences",
			"Biochemistry",
			"Biology",
			"Biomedical Engineering",
			"Broadcast (Communication)",
			"Business Administration",
			"Chemistry",
			"Civil Engineering",
			"Communication",
			"Communication (Mass Communication)",
			"Communication Arts",
			"Computer Science",
			"Computer Engineering",
			"Construction Management",
			"Counselor Education",
			"Creative Writing",
			"Criminal Justice",
			"Curriculum & Instruction",
			"Cybersecurity",
			"Dietetics and Nutrition",
			"Digital Media Studies (Communication)",
			"Disaster Management",
			"Dramatic Arts",
			"Early Childhood Education",
			"Earth Sciences",
			"Economics",
			"Educational Leadership",
			"Educational Administration and Supervision",
			"Electrical Engineering",
			"Elementary Education",
			"Engineering Management",
			"Engineering (See Specializations)",
			"English",
			"Environmental Engineering",
			"Environmental Policy and Management",
			"Environmental Studies",
			"Exceptional Student Education",
			"Finance",
			"Foreign Language Education",
			"Forensic Science",
			"French",
			"Geography",
			"Geosciences",
			"Global and Sociocultural Studies",
			"Global Governance",
			"Global Strategic Communications",
			"Health Informatics and Management Systems",
			"Health Services Administration",
			"Higher Education Administration",
			"History",
			"Hospitality Administration/Management",
			"Human Resource Management",
			"Information Systems",
			"Information Technology",
			"Interdisciplinary Studies",
			"Interior Architecture",
			"International Business",
			"International Real Estate",
			"International Relations",
			"International/Intercultural Education",
			"Journalism (Communication)",
			"Landscape Architecture",
			"Latin American & Caribbean Studies",
			"Law",
			"Liberal Studies",
			"Linguistics",
			"Management",
			"Management Information Systems",
			"Marine Biology",
			"Marketing",
			"Mass Communication",
			"Materials Engineering",
			"Mathematics",
			"Mathematical Sciences",
			"Mechanical Engineering",
			"Medicine",
			"Military Science Electives",
			"Music Teacher Education",
			"Music",
			"Nursing",
			"Nursing Practice",
			"Occupational Therapy",
			"Philosophy",
			"Physical Education",
			"Physical Therapy",
			"Physician Assistant Studies",
			"Physics",
			"Political Science",
			"Portuguese",
			"Psychology",
			"Public Administration",
			"Public Affairs",
			"Public Health",
			"Public Relations (Communication)",
			"Reading Education",
			"Real Estate",
			"Recreation and Sports Management",
			"Religious Studies",
			"School Psychology",
			"Social Welfare",
			"Social Work",
			"Sociology",
			"Spanish",
			"Speech Language Pathology",
			"Special Education",
			"Statistics",
			"Student Counseling/Guidance/Counselor Education",
			"Studio Art",
			"Economics",
			"Telecommunications/Networking",
			"Theatre",
			"Urban Education",
			"Visual Arts",
			"Women's Studies"
		];

		vm.schools = ['Architecture + The Arts ',
			'Business',
			'Chaplin School of Hospitality and Tourism Management',
			'Engineering & Computing',
			'Herbert Wertheim College of Medicine',
			'Journalism and Mass Communication',
			'Law',
			'Nicole Wertheim College of Nursing & Health Sciences',
			'Robert Stempel College of Public Health & Social Work',
			'Steven J. Green School of International and Public Affairs'

		];

		vm.genders = ['Male', 'Female'];




    }
})();
