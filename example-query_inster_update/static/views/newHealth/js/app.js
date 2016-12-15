var hrApp = angular.module('hrApp',['ui.router','ui.bootstrap','ngDialog','ngTip','tm.pagination','personModule','relationModule','profileModule','consultmrModule','MyFilterModule']);

hrApp.run(function($rootScope,$state,$stateParams){
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
});

hrApp.config(function($stateProvider, $urlRouterProvider){
	 $urlRouterProvider.otherwise('/person');
	 $stateProvider
		 .state('index', {
	         url: '/person',
	         views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
	                '': {
	                    templateUrl: 'tpls/list.html'
	                },
	                'tableSchema@index': {
	                    templateUrl: 'tpls/tableSchema.html'
	                },
	                'custGrid@index': {
	                    templateUrl: 'tpls/personGrid.html'
	                }
	           }
	     })
		 .state('relation', {
	         url: '/relation',
	         views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
	                '': {
	                    templateUrl: 'tpls/list.html'
	                },
	                'tableSchema@relation': {
	                    templateUrl: 'tpls/tableSchema.html'
	                },
	                'custGrid@relation': {
	                    templateUrl: 'tpls/relationGrid.html'
	                }
	           }
	     })
	     .state('list', {
	         url: '/{tn:[0-9]{1,4}}',
	         views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
	                '': {
	                    templateUrl: 'tpls/list.html'
	                },
	                'tableSchema@list': {
	                    templateUrl: 'tpls/tableSchema.html'
	                },
	                'custGrid@list': {
	                    templateUrl: 'tpls/profileGrid.html'
	                }
	           }
	     }).state('consultmr', {
	         url: '/consultmr',
	         views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
	                '': {
	                    templateUrl: 'tpls/list.html'
	                },
	                'tableSchema@consultmr': {
	                    templateUrl: 'tpls/tableSchema.html'
	                },
	                'custGrid@consultmr': {
	                    templateUrl: 'tpls/consultmrGrid.html'
	                }
	           }
	     })
        
});
