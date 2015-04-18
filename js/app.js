(function(){
 	    var el;
    var options;
    var canvas;
    var span;
    var ctx;
    var radius;

    var createAllVariables = function(){
        options = {
            percent:  el.getAttribute('data-percent') || 25,
            size: el.getAttribute('data-size') || 165,
            lineWidth: el.getAttribute('data-line') || 15,
            rotate: el.getAttribute('data-rotate') || 225,
            color: el.getAttribute('data-color')
        };

        canvas = document.createElement('canvas');
        span = document.createElement('span');
        span.textContent = options.percent + '%';

        if (typeof(G_vmlCanvasManager) !== 'undefined') {
            G_vmlCanvasManager.initElement(canvas);
        }

        ctx = canvas.getContext('2d');
        canvas.width = canvas.height = options.size;
        el.appendChild(span);
        el.appendChild(canvas);

        ctx.translate(options.size / 2, options.size / 2); // change center
        ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

        radius = (options.size - options.lineWidth) / 2;
    };


    var drawCircle = function(color, lineWidth, percent) {
        percent = Math.min(Math.max(0, percent || 1), 1);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
        ctx.strokeStyle = color;
        ctx.lineCap = 'round'; // butt, round or square
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    };

    var drawNewGraph = function(id){
        el = document.getElementById(id);
        createAllVariables();
        drawCircle('#333333', options.lineWidth, 1.0*0.75);
        drawCircle(options.color, options.lineWidth - options.lineWidth*25/100, (options.percent / 100)*0.75 );


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
				console.log("Groups loaded");
				console.log("Wait till renders...");
				$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
					console.log("ng-repeat FINISHED!");
					drawNewGraph('graph1');
					console.log("graph created");
				});
				
			},
			controllerAs: 'gWidget'
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
			course: "HY464",
			name: 'Ομάδα-1',
			author: 'Alexandros',
			title: 'Mobile application development.',
			members: 3,
			maxmembers: 4
		},
		{
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			members: 1,
			maxmembers: 2
		},
		{
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			members: 1,
			maxmembers: 2
		},
		{
			course: "HY454",
			name: 'Omada12',
			author: 'Eleni',
			title: 'Web application development.',
			members: 1,
			maxmembers: 2
		}
	];

})();