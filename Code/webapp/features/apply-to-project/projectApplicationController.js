angular
    .module('projectApplicationController', ['ProjectProposalService', 'userService'])
    .controller('projAppCtrl', function(ProjectService,User,$stateParams) {
        var vm = this;

        vm.mockData = [{
            firstName: "Marlon",
            lastName: "Rowe",
            email: "mrowe009@fiu.edu",
            pID: "1234567",
            rank: "Senior",
            gender: 'Male',
            type: 'Student',
            college: "'Engineering & Computing",
            school: "School of Computing and Information Sciences",
            semester: "Spring 2016"
        }];

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
        vm.semesters = ['Spring 2016', 'Summer 2016'];

        vm.ranks =  [
            'Freshman',
            'Sophmore',
            'Junior',
            'Senior',
            'Masters',
            'PhD',
            'postDoc'
        ];

        vm.selectedCollege = vm.Colleges[1];

        init();
        function init () {
            loadData();
        }


        function loadData(){
            ProjectService.getProjects().then(function(data){
                vm.projects = data;
                if($stateParams.id){
                    vm.id = $stateParams.id;
                    getProjectById(vm.projects);
                } else {
                    vm.sProject = null;
                }
            });
        }
        function getProjectById (projects){
            ProjectService.getProject(vm.id).then(function(data){

                projects.forEach( function (project)
                {
                    if(data._id === project._id)
                    {
                        vm.sProject = project;
                    }
                });
            });
        }



        vm.firstName = vm.mockData[0].firstName;
        vm.type = vm.mockData[0].type;
        vm.lastName = vm.mockData[0].lastName;
        vm.gender = vm.mockData[0].gender;
        vm.email = vm.mockData[0].email;
        vm.pID= vm.mockData[0].pID;
        vm.rank = vm.mockData[0].rank;
        vm.school = vm.selectedCollege.schools[0];
        vm.college = vm.mockData[0].college;
        vm.semester = vm.mockData[0].semester;


        vm.save = function() {
            vm.mockData[0].firstName = vm.firstName;
            vm.mockData[0].lastName = vm.lastName;
            vm.mockData[0].email = vm.email;
            vm.mockData[0].pID = vm.pID;
            vm.mockData[0].rank = vm.rank;
            vm.mockData[0].school = vm.school;
            vm.mockData[0].college = vm.college;

            console.log(vm.mockData[0].rank);
        };
    });
