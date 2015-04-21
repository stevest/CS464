(function(){

	function cicrbar(){
		this.init = function(id,mem,maxmem){
			this.id = id;
			this.mem = mem;
			this.maxmem = maxmem;
			el = document.getElementById(this.id);
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
	
	var app = angular.module('pm',[]);
	
	app.directive('groupWidgets',function(){
		return{
			restrict: 'E',
			templateUrl: 'group-widgets.html',
			controller:function($scope){
			//controller is this:
				this.groups = allGroups;
				console.log($scope);
				console.log("Wait till renders...");
				$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
					console.log("ng-repeat FINISHED!");
					var bars = new Array($scope.gWidget.groups.length);
					
					for (i=0 ; i < $scope.gWidget.groups.length ; i++) {
						console.log($scope.gWidget.groups[i].id);
						//drawNewGraph("graph"+$scope.gWidget.groups[i].id,40);
						bars[i] = new cicrbar();
						//console.log("percent is"+$scope.gWidget.groups[i].members/$scope.gWidget.groups[i].maxmembers*100);
						bars[i].init("graph"+$scope.gWidget.groups[i].id,$scope.gWidget.groups[i].members,$scope.gWidget.groups[i].maxmembers);
						bars[i].draw();
					}
					console.log("graph created");
					//$(function () {
						console.log("RUNNING JQUERY");
					    /* Show / Hide action buttons on hover */
					    var myTimeout;
					    $('.comment').mouseenter(function() {
					        console.log("footer-mousehover");
					        var comment_footer = $(this).find('.comment-footer');
					        myTimeout = setTimeout(function() {
								comment_footer.slideDown(100);
					        }, 1);
					    }).mouseleave(function() {
					        clearTimeout(myTimeout);
					        $(this).find('.comment-footer').slideUp(100);
					    });

					    /* Edit a comment */
					    $('.edit').on('click', function(e){
					      e.preventDefault();
					      $('#modal-edit-comment').modal('show');
					    });

					    /* Delete a comment */
					    $('.delete').on('click', function(){
					      $(this).closest('.comment').hide();
					    });

					    /* Checkbox select */
					    $('input:checkbox').on('ifClicked', function () {
					        if ($(this).parent().hasClass('checked')) {
					            $(this).closest('.comment').removeClass('selected');
					            $(this).closest('.comment').find(':checkbox').attr('checked', false);
					        } else {
					            $(this).parent().addClass('checked');
					            $(this).closest('.comment').addClass('selected');
					            $(this).closest('.comment').find(':checkbox').attr('checked', true);
					        }
					    });


					//});
				});
				
			},
			controllerAs: 'gWidget',
			link:function(){
				console.log("LINKED!");
				//drawNewGraph("graph1");
			}
		};
	});
	app.directive('onFinishRender',function($timeout){
		return{
			restrict:'A',
			link: function(scope,element,attr){
				if(scope.$last === true) {
					$timeout(function(){
						scope.$emit('ngRepeatFinished');
					});
				}
			}
		}
	});
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
	
	var allGroups = [
		{
			id:1,
			course: "HY464",
			name: 'Ομάδα-1',
			author: 'Alexandros',
			title: 'Mobile application development.',
			members: 3,
			maxmembers: 4
		},
		{
			id:2,
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			members: 1,
			maxmembers: 2
		},
		{
			id:3,
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			members: 3,
			maxmembers: 3
		},
		{
			id:4,
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			members: 0,
			maxmembers: 2
		}
	];

})();