var image;

var resume;

function uploadImage() {
			
			var obj = document.getElementById('profileImage');
			var pI = document.getElementById('pI');
			pI.max = 100;
			pI.value = 0;	
			if (obj.files.length == 0) 
			{
					
			}
			else 
			{
				pI.style.visibility = "visible";
			
				var f = obj.files[0];
				var r = new FileReader();
				r.onprogress = function(event) {
					if (event.lengthComputable) {
						pI.max = event.total;
						pI.value = event.loaded;
					}
				};
				r.onloadend = function(e)
				{
					
					var dataURL = e.target.result;
					image = dataURL;
					
				}
				r.readAsDataURL(f);
			}
};


function uploadResume() {
			
			var obj2 = document.getElementById('profileResume');
			var pR = document.getElementById('pR');
			pR.max = 100;
			pR.value = 0;	
			if (obj2.files.length == 0) 
			{
			}
			else
			{
					pR.style.visibility = "visible";
					var f2 = obj2.files[0];
					var r2 = new FileReader();
					r2.onprogress = function(event) {
						if (event.lengthComputable) {
							pR.max = event.total;
							pR.value = event.loaded;
						}
					};
					r2.onloadend = function(e2)
					{
							var dataURL2 = e2.target.result;
							resume = dataURL2;
							
					};
					r2.readAsDataURL(f2);
			}
			
};


(function () {
    'use strict';
	
	

    angular
        .module('user-profile', ['userService'])
        .controller('profileController', profileController);

    profileController.$inject = ['$location','$state', '$scope', 'ProfileService','User'];
    /* @ngInject */
    function profileController($location,$state, $scope, ProfileService,User)
    {
        var vm = this;
        vm.profile;
        vm.image = "";
		vm.updateProfile = updateProfile;
		vm.destroyAccount = destroyAccount;
	
		
		var currRank;

        init();
        function init(){
            loadProfileData();
        }

        function loadProfileData(){
            ProfileService.loadProfile().then(function(data){
                vm.profile = data;
                ////console.log(vm.profile.userType);
                currRank = vm.profile.userType;
                
                // get the right index for the school/dept of the current college user is in
                for (var i = 0; i < vm.Colleges.length; i++)
                {
                    if (vm.Colleges[i].name == vm.profile.college)
                    {
                        vm.selectedCollege = vm.Colleges[i];
                    }
                }
                
            });
        }

        // save changes to profile
		function updateProfile () {
			
			loading();
			
			if (image)
				vm.profile.image = image;
			if (resume)
				vm.profile.resume = resume;

			ProfileService.saveProfile(vm.profile).then(function(data)
			{
				// user is trying to change the userType, which may need approval
				if (vm.profile.userType != currRank)
				{
					// however, Pi/CoPi/Coordinators can update the profile without approval
					if (vm.profile.isSuperUser)
					{
						success_msg();
					}

					// otherwise, this requested userType change needs approval
					else
					{
						success_msg_student();
					}
				}

				// changing anything else doesnt need approval
				else
				{
					success_msg();
				}
			});
		}


		function destroyAccount () {
			 swal({   
                title: "You are about to delete your account!",   
                text: "You will lose your spot in any joined projects and will need to be reapproved.",   
                type: "warning",   
                confirmButtonText: "Continue" ,
                showCancelButton: true,
            }, function () 
            {
            	setTimeout(function () { deleteUser(); }, 500);
            }
            );
		}
        
        // refresh profile page after changes are saved
        //function refreshProfilePage () { setTimeout(function () { location.reload(true); }, 3000); }

        function deleteUser() {
        	swal({   
                title: "Final warning!",   
                text: "You will not be able to redo this action",   
                type: "warning",   
                confirmButtonText: "Delete my account" ,
                showCancelButton: true
	             }, function () 
	             {
	                 User.delete(vm.profile._id).then(function(){
	                 	   $location.path('home').then(function(){
	                 	   		setTimeout(function () { 
	                 	   			swal({   
					                 title: "Account deleted",   
					                 text: "You will need to create a new account if you wish to join",   
					                 type: "info",   
					                 confirmButtonText: "Continue" ,
						             }) 
	                 	   		}, 3000);
	                 	   });
	                 });
	            });
        }

		function success_msg()
         {
            swal({   
                title: "Profile Updated!",   
                text: "Your profile will now reflect the changes",   
                type: "success",   
                confirmButtonText: "Great!" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
                window.location.reload();
            }
            );
        };
		
		function loading() {
			swal({   
               title: '',
			   text: 'Loading Please Wait...',
			   html: true,
			   timer: 10000,   
			   showConfirmButton: false
            }
            );
		}

        function success_msg_student()
         {
            swal({   
                title: "Profile Updated!",   
                text: "Your profile will now reflect the changes once approved by PI",   
                type: "success",   
                confirmButtonText: "Great!" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
                window.location.reload();
            }
            );
        };


		vm.users = ["Student",
			"Staff/Faculty",
			"Pi/CoPi"
		];

		vm.ranks = [
			{ "name" : "Freshman", "rank" : "Student" },
			{ "name" : "Sophmore", "rank" : "Student" },
			{ "name" : "Junior", "rank" : "Student" },
			{ "name" : "Senior", "rank" : "Student" },
			{ "name" : "Masters", "rank" : "Student" },
			{ "name" : "PhD", "rank" : "Student" },
			{ "name" : "postDoc", "rank" : "Student" },
			{ "name" : "PI", "rank" : "Pi/CoPi" },
			{ "name" : "CoPI", "rank" : "Pi/CoPi" },
			{ "name" : "Coordinator", "rank" : "Pi/CoPi" },
			{ "name" : "External Member", "rank" : "Pi/CoPi" },
			{ "name" : "Administrator", "rank" : "Staff/Faculty" },
			{ "name" : "Director", "rank" : "Staff/Faculty" },
			{ "name" : "Instructor", "rank" : "Staff/Faculty" },
			{ "name" : "Assitant Professor", "rank" : "Staff/Faculty" },
			{ "name" : "Associate Professor", "rank" : "Staff/Faculty" },
			{ "name" : "Full Professor", "rank" : "Staff/Faculty" }
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

		vm.Colleges = [
            {
                name: 'Architecture + The Arts ',
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

		vm.genders = ['Male', 'Female'];

    }
})();
