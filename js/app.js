(function(){
	var app = angular.module('pm',[]);
	
	app.directive('groupWidgets',function(){
		return{
			restrict: 'E',
			templateUrl: 'group-widgets.html',
			controller:function(){
				this.groups = allGroups;
				//console.log("blah de blah");
			},
			controllerAs: 'gWidget'
		};
	});
	/*app.controller('groupController',function(){
		this.group = aGroup;
	});*/
	
	var allGroups = [
		{
			course: "HY464",
			name: 'Omada1',
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
		}
	];

})();