(function(){

	var app = angular.module('pm',[
		'ngTable',
		'ngRoute',
		'ui.bootstrap'
		])
		.factory('UserService',['$http', function($http){
		  var UserService = {
			  loggedIn: false,
			  username: null,
			  name: null,
			  surname: null,
			  avatar: null,
			  isLogged: function(){
				  return UserService.loggedIn; 
			  },
			  logIn: function () {
					  console.log("Login Succeded!");
					  UserService.loggedIn = true;
					  UserService.username = "Alexandra";
					  UserService.name = "Αλεξάνδρα";
					  UserService.surname = "Γεωργίου";
					  UserService.avatar = "assets/img/avatars/avatar1_big.png";
			  },
			  logOut: function(){
				  UserService.loggedIn = false;
				  UserService.username = null;
				  UserService.name = null;
				  UserService.surname = null;
				  UserService.avatar = null;
			  }
		  };
		  return UserService;
	  }]);

		app.config(function($routeProvider){
	    $routeProvider
			// Route for the Home page
			.when('/',{
	      templateUrl: '/Projects/Projects.html'
	    })
			// Route for the Projects page
			.when('/Projects',{
	      templateUrl: '/Projects/Projects.html',
				controller: 'ProjectsController'
	    })
			// Route for the Groups page
			.when('/Groups',{
	      templateUrl: '/Groups/Groups.html'
	    })
			// Route for the Course page
			.when('/Course',{
	      templateUrl: '/Course/Course.html',
				controller: 'CourseController'
	    })
			//Default redirection:
			.otherwise( { redirectTo: '/Projects/Projects.html' } );
	  });

		app.controller('ProjectsController', ['$http', '$scope', '$filter', '$location', 'NgTableParams', 'UserService',
		function ($http, $scope, $filter, $location, NgTableParams, UserService) {
			$http({ method: 'GET', url: '/projects.json' }).success(function (data) {
				$scope.data = data.projects;
				$scope.$parent.data = data.projects;
				$scope.executeFunction = function (u) {
					console.log("Cliked on table element " + u.code);
					$scope.$parent.courseClicked = u.code;
					$location.path("/Course");
				};

				$scope.tableParams = new NgTableParams({
					page: 1,            // show first page
					count: 10,          // count per page
					sorting: {
						author: 'asc'     // initial sorting
					}
				},
					{
						total: $scope.data.length, // length of data
						getData: function ($defer, params) {
							// use build-in angular filter
							var orderedData = params.sorting() ?
								$filter('orderBy')($scope.data, params.orderBy()) :
								$scope.data;

							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					});
			});
		}]);
		app.controller('CourseController',['$scope', '$filter', 'UserService', function($scope, $filter, UserService){
			$scope.course = $filter('filter')($scope.$parent.data, {code: $scope.$parent.courseClicked})[0];
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
		app.directive('mynavbar', ['$timeout','UserService', function($timeout, UserService){
			return{
				restrict: 'A',
				controller: function($scope){
					$scope.usrService = UserService;
				  },
				  //controllerAs: 'navbarCtrl',
				link: function(scope, element, attrs){
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
					console.log($scope);
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

	app.directive('groupsWidgets',function($timeout){
		return{
			restrict: 'E',
			templateUrl: 'Groups/groups-widgets.html',
			controller:function($scope){
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
						console.log(scope.group.name);
						console.log(element.parent().find(".gw-id"+scope.group.id).height());
						console.log(element.parent().parent().find('.gwidget_holder').height());
						console.log(element.parent().find(".gw-id"+scope.group.id));
						console.log(scope.$parent.groups.length);
						if (!scope.group.maximized) {
							//element.parent().find(".gw-id"+scope.group.id).css({"position":"absolute","z-index":4});
					    	//element.parent().find(".gw-id"+scope.group.id).width("100%");
					    	//element.parent().find(".gw-id"+scope.group.id).height("100%");
								$("html, body").animate({ scrollTop: 0 }, 400);
								for ( var k = 1 ; k <= scope.$parent.groups.length ; k++ ){
									if (scope.group.id != k){
										//console.log(element.parent().find(".gw-id"+k));
										console.log(element.parent().find(".gw-id"+k));
										element.parent().find(".gw-id"+k).css({"display":"none"});
									}
								}
					    	scope.$apply(function(){
					    		scope.group.maximized = true;
					    	});
					    } else {
					    	//element.parent().find(".gw-id"+scope.group.id).css({"position":"relative","z-index":"auto"});
								for ( var k = 1 ; k <= scope.$parent.groups.length ; k++ ){
									if (scope.group.id != k){
										element.parent().find(".gw-id"+k).css({"display":"inline"});
									}
								}
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
	});
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
	app.controller('PanelController',function(){
		//Initialize selected panel to be Groups:
		this.panel = 2;
		this.selectPanel = function(setPanel){
			this.panel = setPanel;
		};
		this.isSelected = function(checkPanel){
			return this.panel == checkPanel;
		};
	});
	app.controller("groupsController",function($scope,$http){
		// function will execute asynchronously.
		$http({method: 'GET', url: '/groups.json'}).success(function(data){
			$scope.groups = data.groups;
		});
		console.log('Data loaded successfuly.');
		//$scope.groups = allGroups;
	});
	app.controller('GroupTypesController',function(){
		//Initialize selected panel to be Owner:
		this.gTab = 1;
		this.selectGTab = function(setTab){
			this.gTab = setTab;
		};
		this.isSelected = function(checkTab){
			return this.gTab == checkTab;
		};
	});
	/*app.controller("groupsController",function($scope){
		$scope.groups = allGroups;
	});*/

})();
