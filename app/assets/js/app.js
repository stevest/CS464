(function(){

	var app = angular.module('pm', [
		'ngTable',
		'ngRoute',
		'ui.bootstrap',
		'angucomplete-alt'
	])
		.factory('ProjectsService', ['$http', '$filter', '$timeout', '$interval', 'UserService', 'NgTableParams', '$location',
		function ($http, $filter, $timeout, $interval, UserService, NgTableParams, $location) {
			var ProjectsService = {
				projectSelected: null,
				projectsInterval: null,
				projectsTimeout: null,
				projects: [],
				loadingProjects: 1,
				getProjects: function () {
					ProjectsService.loadingProjects = 1;
					$http({ method: 'GET', url: 'projects.json' }).success(function (data) {
						ProjectsService.projects = data.projects;
						ProjectsService.tableParams = new NgTableParams({
							page: 1,            // show first page
							count: 10,          // count per page
							sorting: {
								author: 'asc'     // initial sorting
							}
						},
							{
								total: ProjectsService.projects.length, // length of data
								getData: function ($defer, params) {
									// use build-in angular filter
									var orderedData = params.sorting() ?
										$filter('orderBy')(ProjectsService.projects, params.orderBy()) :
										ProjectsService.projects;
									$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
								}
							});
						ProjectsService.loadingProjects = 0;
						console.log("Projects DONE loadingProjects");
					});
				},
				//Show off our preloader:
				projectsTimeout: $timeout(function () {
					ProjectsService.getProjects();
				}, 1000),
				//Update table each # seconds:
				projectsInterval: $interval(function () {
					ProjectsService.getProjects();
				}, 60000),
				projectClicked: function (u) {
					console.log("Cliked on table element " + u.code);
					ProjectsService.projectSelected = u;
					$location.path("/Course");
				}
			};
			return ProjectsService;
		}])
		.factory('UserService', ['$http', '$filter', '$timeout', '$interval',
		function ($http, $filter, $timeout, $interval) {
		var UserService = {
			loggedIn: false,
			username: null,
			name: null,
			surname: null,
			avatar: null,
			isLogged: function () {
				return UserService.loggedIn;
			},
			logIn: function () {
				console.log("Login Succeded!");
				UserService.loggedIn = true;
				UserService.username = "alexandra86";
				UserService.name = "Αλεξάνδρα";
				UserService.surname = "Γεωργίου";
				UserService.avatar = "assets/img/avatars/avatar1_big.png";
				//Show off our preloader:
				UserService.groupsTimeout = $timeout(function () {
					UserService.getGroups();
				}, 1000);
				//Update table each # seconds:
				UserService.groupsInterval = $interval(function () {
					UserService.getGroups();
				}, 60000);
			},
			logOut: function () {
				UserService.loggedIn = false;
				UserService.username = null;
				UserService.name = null;
				UserService.surname = null;
				UserService.avatar = null;
				$timeout.cancel(UserService.groupsTimeout);
				$interval.cancel(UserService.groupsInterval);
			},
			//Set groups accessible from everyone:
			groupsInterval: null,
			groupsTimeout: null,
			groups: [],
			owner: [],
			invited: [],
			pending: [],
			loadingGroups: 1,
			getGroups: function () {
				UserService.loadingGroups = 1;
				$http({ method: 'GET', url: 'groups.json' }).success(function (data) {
					UserService.groups = data.groups;
					UserService.loadingGroups = 0;
					console.log(UserService.groups.length + 'groups loaded successfuly.');
					//Filter groups by owner, invited pending:
					UserService.owner = $filter('filter')(UserService.groups, { creator: UserService.username });
					console.log(UserService.owner);
					UserService.invited = $filter('getByInvited')(UserService.groups, UserService.username);
					console.log(UserService.invited);
					UserService.pending = $filter('getByPending')(UserService.groups, UserService.username);
					console.log(UserService.pending);
					//import users:
					UserService.users = data.users;
					//console.log("array of users");
					//console.log(UserService.users);
				});
			},
			selectUser: function (username) {
				//Get GID of selected user:
				UserService.userClicked = $filter('userByUsername')(UserService.users, username);
				console.log("User clicked is " + UserService.userClicked.name);
			}
		};
		return UserService;
	}]);

	app.config(function ($routeProvider) {
		$routeProvider
		// Route for the Home page
			.when('/#/', {
			templateUrl: '/Projects',
			controller: 'ProjectsController',
			access: {allowGuest: true}
		})
		// Route for the Projects page
			.when('/Projects', {
			templateUrl: 'Projects/Projects.html',
			controller: 'ProjectsController',
			access: {allowGuest: true}
		})
		// Route for the Groups page
			.when('/Groups', {
			templateUrl: 'Groups/Groups.html',
			controller: 'GroupsController',
			access: {allowGuest: false}
		})
		// Route for the Course page
			.when('/Course', {
			templateUrl: 'Course/Course.html',
			controller: 'CourseController',
			access: {allowGuest: true}
		})
		// Route for the Course page
			.when('/Profile', {
			templateUrl: 'Profile/Profile.html',
			controller: 'ProfileController',
			access: {allowGuest: false}
		})
		// Route for the new group page
			.when('/CreateGroup', {
			templateUrl: 'Groups/CreateGroup.html',
			controller: 'CreateGroupController',
			access: {allowGuest: true}
		})
//		// Route for the Search page
//			.when('/Search', {
//			templateUrl: 'Search/Search.html',
//			controller: 'SearchController',
//			access: {allowGuest: true}
//		})
		//Default redirection:
			.otherwise({ redirectTo: 'Projects' });
	});
app.controller('CreateGroupController',['$scope', '$location', 'UserService', 'ProjectsService',
function($scope, $location, UserService, ProjectsService){
	$scope.usrService = UserService;
	$scope.prjService = ProjectsService;
	$scope.newGroup = {};
	$scope.newGroup,id = $scope.usrService.groups.length+1;
	$scope.newGroup.course = '';
	$scope.newGroup.name = "Ομάδα-" + $scope.usrService.groups.length+1;
	$scope.newGroup.creator = $scope.usrService.username;
	$scope.newGroup.title = '';
	$scope.newGroup.maxmembers = 1;
	$scope.newGroup.members = [];
	
}]);
	app.controller('ProjectsController', ['$http', '$scope', '$filter', '$location', 'NgTableParams', 'UserService', '$interval', '$timeout', 'ProjectsService',
		function ($http, $scope, $filter, $location, NgTableParams, UserService, $interval, $timeout, ProjectsService) {
			$scope.prjService = ProjectsService;

		}]);
		
		app.controller('SearchController', ['$scope', 'accessSearchResults', function($scope, accessSearchResults){
			$scope.fromSearch = accessSearchResults;
		}]);
		
		app.controller('CourseController', ['$scope', '$filter', 'UserService', 'ProjectsService',
		function ($scope, $filter, UserService, ProjectsService) {
			$scope.usrService = UserService;
			$scope.prjService = ProjectsService;
			$scope.thisCourse = function(){
				return $scope.prjService.projectSelected;
			};
			$scope.filterGroups = function (courseCode) {
				return $filter('filter')($scope.usrService.groups, { course: courseCode });	
			};
			//Evaluation star rating:
			$scope.maxrate = 5;
//			$scope.hoveringOver = function (value) {
//				$scope.overStar = value;
//				$scope.percent = 100 * (value / $scope.max);
//			};
		}]);
		
		// Create login directive; Inject UserService!
		app.directive('login', ['$timeout','UserService', function($timeout, UserService){
			return{
				restrict: 'A',
				controller: function($scope){
					$scope.usrService = UserService;
				  },
				  //controllerAs: 'loginCtrl',
				link: function(scope, element, attrs){
					$timeout(function(){
						element.find('.btn').on('click',function(){
							$timeout(function(){
							console.log("Login btn clicked!");
							scope.usrService.logIn();
						  console.log('User logged in ! '+ scope.usrService.loggedIn);
						  console.log("Username is " + scope.usrService.username);
						  });
						});	
					});
				}
			};
		}]);
		
		app.controller('ProfileController',['$scope','$filter', 'UserService', function($scope, $filter, UserService){
			$scope.usrService = UserService;
			//initialize active panel: About
			$scope.selectedTab = 1;
			$scope.setSelectedTab = function (tab) {
				$scope.selectedTab = tab;
				console.log('selected profile tab set to '+ tab);
			};
			$scope.tabClass = function (tab) {
				if ($scope.selectedTab == tab) {
					return "active";
				} else {
					return "";
				}
				console.log("tabClass executed");
			};
			$scope.isSelected = function(tab){
				if ($scope.selectedTab == tab) {
					return true;
				} else {
					return false;
				}
			};
			$scope.userInGroups = function (username) {
				return $filter('groupsOfUser')($scope.usrService.groups, username);
			};
		}]);
		
		app.filter('groupsOfUser', function(){
			return function(groups, username){
				var usergroupsArray = [];
				for(var i = 0 ; i < groups.length ; i++){
					for (var k = 0 ; k < groups[i].members.length ; k++){
						if(groups[i].members[k].username == username){
							usergroupsArray.push(groups[i]) ;
						}
					}
				}
				return usergroupsArray;
			};
		});
		
		app.controller('RouteController', ['$scope', '$route', '$routeParams', '$location', '$rootScope', 'UserService',
		function ($scope, $route, $routeParams, $location, $rootScope, UserService) {
			//But check: https://github.com/angular/angular.js/issues/2109
			//WHAAT? https://github.com/angular-ui/ui-router/issues/17
				$scope.usrService = UserService;
				$scope.$on('$routeChangeStart', function (event	, next, current) {
					//console.log("Routing in  progress! ($routeChangeStart)");
					//console.log(next);
					if ( next.access != undefined && !next.access.allowGuest && !$scope.usrService.loggedIn) { 
		                //$location.path("/");
						event.preventDefault();
						alert('$routeChangeStart says: Login to access the page!');
		            }
		        });
				
				$rootScope.$on("$locationChangeStart", function (event, next, current) {
					//console.log("Routing in  progress! ($locationChangeStart)");
					for (var i in window.routes) {
						if (next.indexOf(i) != -1) {
							if (!window.routes[i].access.allowGuest && !$scope.usrService.loggedIn) {
								event.preventDefault();
								alert('$locationChangeStart says: Login to access the page!');
								//$location.path("/Login");
		                    }
		                }
		            }
		        });
		}]);
		
		app.directive('mynavbar', ['$timeout','UserService', 'ProjectsService', '$location', 'accessSearchResults',
		function($timeout, UserService, ProjectsService, $location, accessSearchResults){
			return{
				restrict: 'A',
				controller: function($scope){
					$scope.usrService = UserService;
					$scope.prjService = ProjectsService;
					$scope.fromSearch = accessSearchResults;
					$scope.searchableItems = [];
					$scope.searchResults = [];
					$scope.prevLocation = '';
//					$scope.items = [
//					    'The first choice!',
//					    'And another choice for you.',
//					    'but wait! A third!'
//					  ];
				
				  $scope.status = {
				    isopen: false
				  };
				
//					  $scope.toggled = function(open) {
//					    $log.log('Dropdown is now: ', open);
//					  };
				
				  $scope.toggleDropdown = function($event) {
				    $event.preventDefault();
				    $event.stopPropagation();
				    $scope.status.isopen = !$scope.status.isopen;
				  };
				  $scope.userServiceEvoked = function(){
					   return $scope.usrService.loggedIn;
				  };
//				  $scope.userServiceGetUsers = function(){
//					  //console.log("getting users.........");
//					   return $scope.usrService.users;
//				  };
//				  $scope.userServiceGetProjects = function(){
//					  //console.log("getting projects.........");
//					   //return $scope.prjService.projects;
//				  };
				  $scope.foo = function(selectedItem){
					  console.log("FOO FUNCTION CALLED!");
					  //if item is course go to course page, else
					  //go to student profile:
					  if (!selectedItem.originalObject.title){
						  //is student:
						  console.log("Result is a student!");
						  $scope.usrService.selectUser(selectedItem.originalObject.username);
						  $location.path("/Profile");
					  } else {
						  //is course:
						  console.log("Result is a course!");
						  $scope.prjService.projectClicked(selectedItem.originalObject);
						  console.log(selectedItem);
						  console.log($scope.prjService.projectSelected);
					  }
					  $scope.searchOutFocus();
				  };
				  $scope.searchInFocus = function(){
					  $scope.fromSearch.active = true;
					  //Reset previous results:
					  $scope.fromSearch.searchResults = [];
					  //$scope.prevLocation = $location.path();
					  //$location.path('/Search');
					  //expand search panel:
					  var focusInputElem = document.getElementById('search_value');
				      focusInputElem.classList.remove('search-form-control-small');
					  var focusSearchPanel = document.getElementById('search-panel');
				      focusSearchPanel.classList.add('spanel-full');
				  };
				  $scope.searchOutFocus = function(){
					  $scope.fromSearch.active = false;
					  var focusInputElem = document.getElementById('search_value');
				      focusInputElem.classList.add('search-form-control-small');
					  var focusSearchPanel = document.getElementById('search-panel');
				      focusSearchPanel.classList.remove('spanel-full');
						$scope.$broadcast('angucomplete-alt:clearInput');
					  //$location.path($scope.prevLocation);
				  };
				  
//				  $scope.upsateSearchableItems = function(newItems){
//					  $scope.searchableItems = newItems;
//				  };
				  
					   
//					  $timeout(function(){
//							console.log($scope.userServiceGetUsers());
//							console.log($scope.userServiceGetProjects());
//							console.log($scope.userServiceGetUsers().concat($scope.userServiceGetProjects()));
//					  },4000);

				//Initialize selected panel to be Courses:
						$scope.sTab = 1;
						$scope.selectSTab = function(setTab){
							$scope.sTab = setTab;
							console.log("sTab selected is "+$scope.sTab);
						};
						$scope.isSelected = function(checkTab){
							return $scope.sTab == checkTab;
						};
					  
				},
				  //controllerAs: 'navbarCtrl',
				link: function(scope, element, attrs){
					//Keep an eye for changes in items:
					scope.$watchGroup(['prjService.projects','usrService.users'], function () {
						scope.searchableItems = scope.prjService.projects.concat(scope.usrService.users || []);
						console.log(scope.searchableItems);
						console.log("searchable items updated");
					});
				}
			};
		}]);
		
		app.controller('ModalInstanceCtrl', ['$timeout', '$scope', '$modalInstance', '$modal', '$log', 'UserService',
		function ($timeout, $scope, $modalInstance, $modal, $log, UserService) {
			$scope.usrService = UserService;
			$scope.ok = function () {
				$timeout(function () {
					console.log("Login btn clicked!");
					$scope.usrService.logIn();
					console.log('User logged in ! ' + $scope.usrService.loggedIn);
					console.log("Username is " + $scope.usrService.username);
				});
				$modalInstance.dismiss('cancel');
			};
			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}]);
		
		app.directive('loginModal', ['$timeout', 'UserService', '$modal', '$log', function ($timeout, UserService, $modal, $log) {
			return {
				restrict: 'A',
				controller: function ($scope, $log) { 
					$scope.usrService = UserService;
					$scope.items = ['item1', 'item2', 'item3'];
					$scope.animationsEnabled = true;
					$scope.open = function (size) {
						var modalInstance = $modal.open({
							animation: $scope.animationsEnabled,
							templateUrl: 'myModalContent.html',
							controller: 'ModalInstanceCtrl',
							size: size,
							resolve: {
								items: function () {
									return $scope.items;
								}
							}
						});
						modalInstance.result.then(function (selectedItem) {
							$scope.selected = selectedItem;
						}, function () {
								$log.info('Modal dismissed at: ' + new Date());
							});
					};
					$scope.toggleAnimation = function () {
						$scope.animationsEnabled = !$scope.animationsEnabled;
					};
				},
				link: function (scope, element, attrs) {
					$timeout(function(){
						element.find('.btn.btn-login').on('click',function(){
							$timeout(function(){
							console.log("Login btn clicked!");
							scope.usrService.logIn();
						  console.log('User logged in ! '+ scope.usrService.loggedIn);
						  console.log("Username is " + scope.usrService.username);
						  });
						});	
					});					
				}
			};
		}]);
		/*app.directive('loader',['$http', '$timeout', function($http, $timeout){
			return{
				restrict: 'A',
				controller: function($scope){
						
				},
				link: function (scope, element, attrs){
					scope.isLoading = function () {
						return $http.pendingRequests.length > 0;
	                };
					
	                scope.$watch(scope.isLoading, function (v){
						console.log("V is "+v);
	                    if(v){
	                        element.show();
	                    }else{
	                        element.hide();
	                    }
	                });
	            }
			};
		}]);*/

	app.directive('groupsWidgets',['$timeout', 'UserService', '$filter', function($timeout, UserService, $filter){
		return{
			restrict: 'E',
			templateUrl: 'Groups/groups-widgets.html',
			controller:function($scope){
				$scope.usrService = UserService;
				//Not the best practice:
				$scope.group.maximized = false;
				
				$scope.Cicrbar = function(){
					this.init = function(id,mem,maxmem){
						this.id = id;
						this.mem = mem;
						this.maxmem = maxmem;
						var el = document.getElementById(this.id);
						//console.log("Element got is: "+el);
						this.size = el.getAttribute('data-size') || 165;
						this.lineWidth = el.getAttribute('data-line') || 15;
			            this.color = el.getAttribute('data-color') || "#30bae7";
						this.canvas = document.createElement('canvas');
						this.span = document.createElement('span');
						this.span.textContent = this.mem + '/' + this.maxmem;
			//			if (typeof(G_vmlCanvasManager) !== 'undefined') {
			//				G_vmlCanvasManager.initElement(this.canvas);
			//			}
						this.ctx = this.canvas.getContext('2d');
						this.canvas.width = this.canvas.height = this.size;
						el.appendChild(this.span);
						el.appendChild(this.canvas);
						this.ctx.translate(this.size / 2, this.size / 2); // change center
						this.ctx.rotate((-1 / 2 + 225 / 180) * Math.PI); // rotate -90 deg
						this.radius = (this.size - this.lineWidth) / 2;
					};
					this.drawBar = function(color, lineWidth, percent) {
						percent = Math.min(Math.max(0, percent), 1);
						this.ctx.beginPath();
						this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2 * percent, false);
						this.ctx.strokeStyle = color;
						this.ctx.lineCap = 'round'; // butt, round or square
						this.ctx.lineWidth = lineWidth;
						this.ctx.stroke();
					};
					this.draw = function(){
						this.drawBar('#333333', this.lineWidth, 1.0*0.75);
						this.drawBar(this.color, this.lineWidth - this.lineWidth*25/100, (this.mem/this.maxmem)*0.75 );
					};
				};
				
				//console.log("Length of group members is " + $scope.group.members.length);
				//console.log($scope);
				/*$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
					console.log("ng-repeat FINISHED!");
					var bars = new Array($scope.groups.length);

					for (i=0 ; i < $scope.groups.length ; i++) {
						//console.log($scope.groups[i].id);
						bars[i] = new cicrbar();
						bars[i].init("graph"+$scope.groups[i].id,$scope.groups[i].members.length,$scope.groups[i].maxmembers);
						bars[i].draw();
					}
					console.log("graph created");
				});*/

			},
			/*controllerAs: 'gWidget'*/
			link: function(scope, element, attrs){
				//Render each element as soon as its ready:
				$timeout(function(){
					//scope.$emit('ngRepeatFinished');
					var bar = new scope.Cicrbar();
					bar.init("graph"+scope.group.id,scope.group.members.length,scope.group.maxmembers);
					bar.draw();
					console.log("Done rendering bar!");

					element.mouseenter(function(){
						element.find('.comment-footer').slideDown(100);
					}).mouseleave(function(){
						element.find('.comment-footer').slideUp(100);
					});

					element.find('.maximizeWidget').on('click',function(){
						//console.log(scope.group.name);
						//console.log(element.parent().find(".gw-id"+scope.group.id).height());
						//console.log(element.parent().parent().find('.gwidget_holder').height());
						//console.log(element.parent().find(".gw-id"+scope.group.id));
						//console.log(scope.$parent.groups.length);
						if (!scope.group.maximized) {
							//element.parent().find(".gw-id"+scope.group.id).css({"position":"absolute","z-index":4});
					    	//element.parent().find(".gw-id"+scope.group.id).width("100%");
					    	//element.parent().find(".gw-id"+scope.group.id).height("100%");
								$("html, body").animate({ scrollTop: 0 }, 400);
								// SSS set the visible groups only!!!
								//test a little:
//								console.log("Lenght of owned groups is " + scope.usrService.owner.length);
//								console.log("owned group id is " + scope.group.id);
//								console.log(element.parent().find(".gw-id"+scope.group.id));
								var openGroups = element.parent().find(".gwidget");
								console.log(openGroups);
								
								for ( var k = 0 ; k < openGroups.length ; k++ ){
									console.log("INSIDE LOOP");
									var thisGroup = $(openGroups[k]).find('.gw-id*');
									
									if (scope.group.id != thisGroup.context.className[thisGroup.context.className.indexOf('gw-id')+5]){
										
										
										
										//console.log(thisGroup.context.className.indexOf('gw-id'));
										//$(openGroups[k]).find('.gw-id*').context.className.indexOf('gw-id')
										//console.log(thisGroup.context.className[thisGroup.context.className.indexOf('gw-id')+5]);
										
//										//console.log(element.parent().find(".gw-id"+k));
//										console.log(element.parent().find(".gw-id"+k));
										element.parent().find(".gw-id"+k).css({"display":"none"});
									}
								}
					    	scope.$apply(function(){
					    		scope.group.maximized = true;
					    	});
					    } else {
					    	//element.parent().find(".gw-id"+scope.group.id).css({"position":"relative","z-index":"auto"});
//								for ( var k = 1 ; k <= scope.$parent.groups.length ; k++ ){
//									if (scope.group.id != k){
//										element.parent().find(".gw-id"+k).css({"display":"inline"});
//									}
//								}
					    	scope.$apply(function(){
					    		scope.group.maximized = false;
					    	});
					    }
					});


					/*var gwidget = document.getElementsByClassName('gwidget');
					var gwidgetHolder = document.getElementsByClassName('gwidget_holder');
				    if (gwidget.clientHeight < gwidgetHolder.clientHeight) {
				    	gwidget.style.height = gwidgetHolder.style.height;
				    	gwidget.style.width = gwidgetHolder.style.width;
				    } else {
				    	//gwidget.style.height = gwidgetHolder.clientHeight;
				    	//var wrapper = document.querySelector('.measuringWrapper');
				    	//growDiv.style.height = wrapper.clientHeight + "px";
				    }*/
				});


			}
		};
	}]);
	
app.directive('groupMembers',function($timeout){
		return{
			restrict: 'E',
			templateUrl: 'Groups/group-members.html',
			controller:function($scope){

			},
			/*controllerAs: 'gWidget'*/
			link: function(scope, element, attrs){

			}
		};
	});
	
	/*app.directive('onFinishRender',function($timeout){
		return{
			restrict:'A',
			link: function(scope,element,attr){
				if(scope.$last === true) {
					$timeout(function(){
						scope.$emit('ngRepeatFinished');
						console.log("EMITTING");
						console.log(scope);
						console.log(element.html());
					});
				}
			}
		}
	});*/
	//app.controller('postRender',function(){
	//
	//});
	
	app.directive('panels', ['$location', 'UserService', '$timeout', function ($location, UserService, $timeout) {
		return {
			restrict: 'A',
			controller: function ($scope) {
				$scope.usrService = UserService;
				$scope.panels = [
					{ sn: 0, link: '#/Projects', label: 'Projects' }
				];
				//initialize active panel: Projects
				$scope.selectedPanel = 0;
				$scope.setSelectedPanel = function (panel) {
					$scope.selectedPanel = panel.sn;
					console.log('selected panel set to '+ panel.sn+'with href '+panel.link);
				};
				$scope.panelClass = function (panel) {
					if ($scope.selectedPanel == panel.sn) {
						return "active";
					} else {
						return "";
					}
					console.log("PanelClass executed");
				};
			},
			link: function (scope, element, attrs) {
				scope.$watch('usrService.loggedIn', function (loggedIn) {
					if (scope.usrService.loggedIn) {
						scope.panels = [
							{ sn: 0, link: '#/Projects', label: 'Projects' },
							{ sn: 1, link: '#/Groups', label: 'Groups' }
						];
					} else {
						scope.panels = [
							{ sn: 0, link: '#/Projects', label: 'Projects' }
						];
					}
					
				});
			}
		};
	}]);
	
	app.directive('courseTabs', ['$location', '$timeout', function ($location, $timeout) {
		return {
			restrict: 'A',
			controller: function ($scope) {
				//initialize active panel: Info
				$scope.selectedTab = 1;
				$scope.setSelectedTab = function (tab) {
					$scope.selectedTab = tab;
					console.log('selected course tab set to '+ tab);
				};
				$scope.tabClass = function (tab) {
					if ($scope.selectedTab == tab) {
						return "active";
					} else {
						return "";
					}
					console.log("tabClass executed");
				};
				$scope.isSelected = function(tab){
					if ($scope.selectedTab == tab) {
						return true;
					} else {
						return false;
					}
				};
			}
		};
	}]);
	
	app.filter('getByInvited', function(){
		return function(groups, username){
			var invitedArray = [];
			for(var i = 0 ; i < groups.length ; i++){
				for (var k = 0 ; k < groups[i].invited.length ; k++){
					if(groups[i].invited[k].username == username){
						invitedArray.push(groups[i]) ;
					}
				}
			}
			return invitedArray;
		};
	});
	app.filter('getByPending', function(){
		return function(groups, username){
			var pendingArray = [];
			for(var i = 0 ; i < groups.length ; i++){
				for (var k = 0 ; k < groups[i].pending.length ; k++){
					if(groups[i].pending[k].username == username){
						pendingArray.push(groups[i]) ;
					}
				}
			}
			return pendingArray;
		};
	});
	app.filter('userByUsername', function(){
		return function(users, username){
			for(var i = 0 ; i < users.length ; i++){
				if(users[i].username == username){
					return users[i];
				}
			}
			return null;
		};
	});
	app.controller("GroupsController", ['$scope', '$http', '$timeout', '$interval', '$filter', '$location', 'UserService',
	function($scope, $http, $timeout, $interval, $filter, $location, UserService){
		$scope.usrService = UserService;
		
		$scope.createGroup = function() {
			$location.path('/CreateGroup');
		};
		
		$scope.btnGroups = [
			[
				'SUBMIT GROUP',
				'LEAVE GROUP'
			],
			[
				'PENDING'
			],
			[
				'ACCEPT',
				'DECLINE'
			],
		];
	}]);
	
	app.controller('TabTypesController',function(){
		//Initialize selected panel to be Owner:
		this.gTab = 1;
		this.selectGTab = function(setTab){
			this.gTab = setTab;
		};
		this.isSelected = function(checkTab){
			return this.gTab == checkTab;
		};
	});

})();
