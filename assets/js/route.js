angular.module('pm',[
  'ngTable',
  'ngRoute'
  ])
  .config(function($routeProvider){
    $routeProvider.when('/Projects',{
      templateUrl: 'Projects/Projects.html'
    })
  });
