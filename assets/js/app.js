(function(){

	function cicrbar(){
		this.init = function(id,mem,maxmem){
			this.id = id;
			this.mem = mem;
			this.maxmem = maxmem;
			el = document.getElementById(this.id);
			//console.log("Element got is: "+el);
			this.size = el.getAttribute('data-size') || 165;
			this.lineWidth = el.getAttribute('data-line') || 15;
            this.color = el.getAttribute('data-color') || "#30bae7";
			this.canvas = document.createElement('canvas');
			this.span = document.createElement('span');
			this.span.textContent = this.mem + '/' + this.maxmem;
			if (typeof(G_vmlCanvasManager) !== 'undefined') {
				G_vmlCanvasManager.initElement(canvas);
			}
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



	//------------------------------------------------//
	//------------------------------------------------//
	//------------------------------------------------//

	var app = angular.module('pm',['ngTable']);

	app.directive('groupsWidgets',function($timeout){
		return{
			restrict: 'E',
			templateUrl: 'groups-widgets.html',
			controller:function($scope){
				//Not the best practice:
				$scope.group.maximized = false;
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
					//console.log("Timeout function executed");
					//console.log(scope);
					//console.log(element.html());
					var bar = new cicrbar();
					bar.init("graph"+scope.group.id,scope.group.members.length,scope.group.maxmembers);
					bar.draw();

					element.mouseenter(function(){
						element.find('.comment-footer').slideDown(100);
					}).mouseleave(function(){
						element.find('.comment-footer').slideUp(100);
					});

					element.find('.maximizeWidget').on('click',function(){
						console.log(scope.group.name);
						console.log(element.parent().find(".gw-id"+scope.group.id).height());
						console.log(element.parent().parent().find('.gwidget_holder').height());
						if (!scope.group.maximized) {
							//element.parent().find(".gw-id"+scope.group.id).css({"position":"absolute","z-index":4});
					    	//element.parent().find(".gw-id"+scope.group.id).width("100%");
					    	//element.parent().find(".gw-id"+scope.group.id).height("100%");
								$("html, body").animate({ scrollTop: 0 }, "slow");
								for ( var k = 1 ; k <= scope.$parent.groups.length ; k++ ){
									if (scope.group.id != k){
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
			templateUrl: 'group-members.html',
			controller:function($scope){

			},
			/*controllerAs: 'gWidget'*/
			link: function(scope, element, attrs){

			}
		};
	});
app.directive('groupInvited',function($timeout){
		return{
			restrict: 'E',
			templateUrl: 'group-invited.html',
			controller:function($scope){

			},
			/*controllerAs: 'gWidget'*/
			link: function(scope, element, attrs){

			}
		};
	});
app.directive('groupPending',function($timeout){
		return{
			restrict: 'E',
			templateUrl: 'group-pending.html',
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
	app.controller("groupsController",function($scope){
		$scope.groups = allGroups;
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
	app.controller("groupsController",function($scope){
		$scope.groups = allGroups;
	});
	app.controller('DemoCtrl', function($scope, $filter, NgTableParams) {
            var data = [{pass: "Pass", code: "HY464", author: "Κωνσταντίνος Στεφανίδης", title: "Ανάπτυξη γραφικής διεπαφής για Web.", members:"2"},
                        {pass: "Fail", code: "HY454", author: "Αναστασακης Αλέξανδρος", title: "Ανάπτυξη γραφικής διεπαφής για Mobile.", members:"2"}];

            $scope.tableParams = new NgTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    author: 'asc'     // initial sorting
                }
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')(data, params.orderBy()) :
                                        data;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        })

	var allGroups = [
		{
			id:1,
			course: "HY464",
			name: 'Ομάδα-1',
			author: 'Alexandros',
			title: 'Mobile application development.',
			maxmembers: 4,
			members: [
				{
					name: "Αλέξανδρος",
					surname: "Ιωαννίδης-Παπαγεωργίου",
					email: "alexandros@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Γιώργος",
					surname: "Παπακωνσταντίνου",
					email: "george@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Ελένη",
					surname: "Ιωάννου",
					email: "elena@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			invited: [
				{
					name: "Κώστας",
					surname: "Γλεζέλης",
					email: "kostis@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			pending: [
				{
					name: "Αθανάσιος",
					surname: "Μπίτσιος",
					email: "nassos@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			]
		},
		{
			id:2,
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			maxmembers: 4,
			members: [
				{
					name: "Αλέξανδρος",
					surname: "Ιωαννίδης-Παπαγεωργίου",
					email: "alexandros@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Γιώργος",
					surname: "Παπακωνσταντίνου",
					email: "george@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			invited: [
				{
					name: "Κώστας",
					surname: "Γλεζέλης",
					email: "kostis@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Ελένη",
					surname: "Ιωάννου",
					email: "elena@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			pending: [
				{
					name: "Αθανάσιος",
					surname: "Μπίτσιος",
					email: "nassos@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			]
		},
		{
			id:3,
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			maxmembers: 4,
			members: [
				{
					name: "Αλέξανδρος",
					surname: "Ιωαννίδης-Παπαγεωργίου",
					email: "alexandros@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			invited: [
				{
					name: "Κώστας",
					surname: "Γλεζέλης",
					email: "kostis@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			pending: [
				{
					name: "Αθανάσιος",
					surname: "Μπίτσιος",
					email: "nassos@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Γιώργος",
					surname: "Παπακωνσταντίνου",
					email: "george@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Ελένη",
					surname: "Ιωάννου",
					email: "elena@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			]
		},
		{
			id:4,
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			maxmembers: 4,
			members: [
				{
					name: "Αλέξανδρος",
					surname: "Ιωαννίδης-Παπαγεωργίου",
					email: "alexandros@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Γιώργος",
					surname: "Παπακωνσταντίνου",
					email: "george@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			invited: [
				{
					name: "Κώστας",
					surname: "Γλεζέλης",
					email: "kostis@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			pending: [
				{
					name: "Αθανάσιος",
					surname: "Μπίτσιος",
					email: "nassos@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Ελένη",
					surname: "Ιωάννου",
					email: "elena@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			]
		},
		{
			id:5,
			course: "HY359",
			name: 'Omada15',
			author: 'Giorgos',
			title: 'Design',
			maxmembers: 4,
			members: [
				{
					name: "Αλέξανδρος",
					surname: "Ιωαννίδης-Παπαγεωργίου",
					email: "alexandros@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Γιώργος",
					surname: "Παπακωνσταντίνου",
					email: "george@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				},
				{
					name: "Ελένη",
					surname: "Ιωάννου",
					email: "elena@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			invited: [
				{
					name: "Κώστας",
					surname: "Γλεζέλης",
					email: "kostis@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			],
			pending: [
				{
					name: "Αθανάσιος",
					surname: "Μπίτσιος",
					email: "nassos@csd.uoc.gr",
					avatar: "assets/img/avatars/avatar1_big.png"
				}
			]
		}
	];

})();
