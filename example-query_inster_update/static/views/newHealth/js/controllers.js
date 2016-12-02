
var personModule = angular.module("personModule", []);
personModule.controller('personCtrl', function($scope,ngDialog,ngTip,$timeout,$http, $state, $stateParams) {
	//修改菜单颜色
    $('#tn_person').addClass("active");
    
	var vm = $scope.vm = {};  
	vm.user = {};
	var timeout; 
	
	 var selectPerson = function(url){
		 if($scope.searchText==''|| $scope.searchText==null ){
			ngTip.tip('请输入查询的用户ID','warning'); 
			return;
		  } 
	      var param = {userId: $scope.searchText};
	       
	      $http.post(url,param).success(function(data){
	    	console.info(data);	
	    	if(data.success){
	    		vm.user=data.result;
	    	}else{
	    		ngTip.tip(data.msg,'danger'); 
	    	}
	        
	      });
	 }
	 $scope.$watch('searchText', function (newVal, oldVal) {
			
	        if (newVal !== oldVal) {
	            if (timeout) $timeout.cancel(timeout);
	            timeout = $timeout(function() {
	               console.info($scope.searchText);
	               selectPerson('/nhc/findHealthPerson');
	            }, 800);
	        }
	    }, true);
	 
	 $scope.openAddPage = function (){
         $scope.value = true;
         $scope.isUpdate=false;
         vm.user ={
    		gender:'0',
    		marStatus:'2'
    	 };
         ngDialog.open({
        	 showClose: false,
             template: 'tpls/editPerson.html',
             className: 'ngdialog-theme-plain',
             width: 650,
             scope: $scope,
             cache: false,
             data:{isUpdate:false,title:'添加用户'}
         });
     }
     $scope.openUpdatePage = function(){
    	 $scope.value = true;
    	 $scope.isUpdate=true;
    	 selectPerson('/nhc/findHealthPerson');
    	
    	 if(vm.user.userId==null || vm.user.userId==""){
    		 ngTip.tip('获取用户数据错误','danger'); 
    		 return;
    	 }
    	// console.info(vm.user);
    	
    	 var strTime=vm.user.birthday;      //字符串日期格式          
    	 if(strTime !=undefined){
    		
    		 vm.user.birthday = new Date(Date.parse(strTime.replace(/-/g,"/"))); //转换成Date(); 
    	 }
    	 
    	 ngDialog.open({
        	 showClose: false,
             template: 'tpls/editPerson.html',
             className: 'ngdialog-theme-plain',
             width: 650,
             scope: $scope,
             cache: false,
             data:{isUpdate:true,title:'更新用户'}
             
         });
     }
   
     $scope.submitForm = function(isValid) {
    	 console.info('isUpdate:'+$scope.isUpdate);
    	 
    	  if (!isValid) {
    		  ngTip.tip('表单验证失败','danger');
    	  }else{
    		
	    	 var ddate = vm.user.birthday;
	    	 var ddateStr = ddate.getFullYear()+"-"+(ddate.getMonth()+1)+"-"+ddate.getDate();	    	 
	    	 $scope.vm.user.birthday = ddateStr;
	    	// console.info($scope.vm.user);
	    	 var url;
	    	 if($scope.isUpdate){
	    		 url = "/nhc/updateUser"
	    	 }else{
	    		 url = "/nhc/createUser";
	    	 }
	    	 $http.post(url,$scope.vm.user).success(function(data){
	         	console.info(data);
	            if(data.flag==1){
	            	ngDialog.close();
	            	if($scope.isUpdate){
	            		ngTip.tip('更新用户成功!','success');
	            	}else{
	            		ngTip.tip('添加用户成功!','success');
	            	}
	            	
	            }else{
	            	ngTip.tip(data.msg,'danger');
	            } 
	         });
    	  }
     };
     
     ////////////////
     ////////////////
     //$scope.dat = null;
     $scope.format = "yyyy-MM-dd";
     $scope.altInputFormats = ['yyyy/MM/dd'];
      
     $scope.popup1 = {
        opened: false
     };
	 $scope.open1 = function () {
		 $scope.popup1.opened = true;
	 };
	 $scope.dateOptions = {
		 customClass: getDayClass,//自定义类名
		// dateDisabled: isDisabled//是否禁用
	 }
 
 
	 var tomorrow = new Date();
	 tomorrow.setDate(tomorrow.getDate() + 1);
	 var afterTomorrow = new Date();
	 afterTomorrow.setDate(tomorrow.getDate() + 1);
	 $scope.events = [
	   {
		   date: tomorrow,
		   status: 'full'
	   },
	   {
		   date: afterTomorrow,
		   status: 'partially'
	   }
	 ];
	 //为日期面板中的每个日期（默认42个）返回类名。传入参数为{date: obj1, mode: obj2}
	 function getDayClass(obj) {
		 var date = obj.date,
		   mode = obj.mode;
		 if (mode === 'day') {
			 var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

			 for (var i = 0; i < $scope.events.length; i++) {
				 var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

				 if (dayToCheck === currentDay) {
					 return $scope.events[i].status;
				 }
			 }
		 }
		 return '';
	 }
	 //设置日期面板中的所有周六和周日不可选
	/* function isDisabled(obj) {
		 var date = obj.date,
		   mode = obj.mode;
		 return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	 }*/
	
});
 
var relModule = angular.module("relationModule", []);
relModule.controller('relationCtrl', function($scope,$timeout,ngDialog,ngTip,$http, $state, $stateParams) {
	//修改菜单颜色
    $('#tn_relation').addClass("active");
	
	 $scope.columns = [
            '序号', '用户ID', '姓名','来源','性别',
            '血型','生日','地址','关系'
	  ];
	 $scope.openConfirm = function (userId,refCode) {
		 if($scope.searchText2==''|| $scope.searchText2==null ){
			ngTip.tip('查询的主用户id不能为空.','danger');
			return;
		 } 
		 var keyword = $scope.searchText2;
		 console.info(userId+","+refCode);
         ngDialog.openConfirm({
            // template: 'modalDialogId',
             template:
                 '<p>确定要修改'+refCode+'关系吗?</p>' +
                 '<div class="ngdialog-buttons">' +
                     '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No' +
                     '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes' +
                 '</button></div>',
             plain:true,
             className: 'ngdialog-theme-plain'
         }).then(function () {
             //console.log('Modal promise resolved. Value: ', value);
        	
        	 $http.post("/nhc/updateRelation",{userId:$scope.searchText2,slaveUserId:userId,refCode:refCode}).success(function(data){
             	console.info(data)
                if(data.flag==1){
                	ngTip.tip(data.msg,'success');
                	getSlaveUsers();
                }else{
                	ngTip.tip(data.msg,'danger');
                } 
             });
         }, function (reason) {
             console.log('Modal promise rejected. Reason: ', reason);
         });
         
        
     };
	var getSlaveUsers = function () {
		if($scope.searchText2==''|| $scope.searchText2==undefined ){
			return;
		} 
        var postData = {
        	userId:	$scope.searchText2,
            pageSize: $scope.paginationConf.itemsPerPage,
            curPage: $scope.paginationConf.currentPage
        }
        console.info(postData);
        $http.post("/nhc/getSlaveUsers",postData).success(function(data){
        	console.info(data.result)
            $scope.paginationConf.totalItems = data.errorCode;
            $scope.items = data.result;
        });
    }
	 var timeout; 
	 $scope.$watch('searchText2', function (newVal, oldVal) {
	        if (newVal !== oldVal) {
	            if (timeout) $timeout.cancel(timeout);
	            timeout = $timeout(function() {
	               console.info("relation query"+$scope.searchText2)
	               //console.info($scope.searchText2);
	               getSlaveUsers();
	              
	            }, 800);
	        }
	    }, true);
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10
    };

    /***************************************************************
    当页码和页面记录数发生变化时监控后台查询
    如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。 
    ***************************************************************/
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getSlaveUsers);

});


var profileModule = angular.module("profileModule", []);
profileModule.controller('profileCtrl', function($scope,ngDialog,ngTip,$timeout,$http,$state,$stateParams) {
	console.info($stateParams.tn);
	var timeout; 
    //修改菜单颜色
    var menuid = "#tn"+$stateParams.tn;
    $(menuid).addClass("active");
   
	 $scope.$watch('searchProfile', function (newVal, oldVal) {
		 //console.info('watch:newVal='+newVal+",oldVal="+oldVal);
	        if (newVal !== oldVal) {
	            if (timeout) $timeout.cancel(timeout);
	            timeout = $timeout(function() {
	            	
	               selectProfile();
	               
	            }, 800);
	        }
	    }, true);
	 
	 var selectProfile = function(){
		 if($scope.searchProfile=='' || $scope.searchProfile==undefined){
			 console.info('not query');
			 return;
		 }
	        var param = {
	        		userId: $scope.searchProfile,
	        		tableName:$stateParams.tn,
	        		pageSize: $scope.paginationConf.itemsPerPage,
	                curPage: $scope.paginationConf.currentPage
	        		};
	        console.info(param);
	        $http.post("/nhc/findProfile",param).success(function(data){
	        	console.info(data);
	        	
	        	if(data.success){
	        		var arr = data.result;
	        		
		        	if(arr.length>1){
		        		 $scope.multiData=true;
		        		 $scope.singleData=false;
		        		 $scope.paginationConf.totalItems = data.errorCode;
		                 $scope.items = data.result;
		        	}else{
		        		$scope.multiData=false;
		        		$scope.singleData=true;
		        		$scope.profile = arr[0];
		        	}
		        	$scope.queryError = false;
	        	}else{
	        		
	        		$scope.multiData = false;
	        		$scope.singleData = false;
	        		$scope.queryError = true;
	        		$scope.queryMsg = data.msg;
	        	}
	        });
	 }
	 
	 $scope.columns = ['序号','personId','userId','orgCode','created','操作'];
	//配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10
    };

    /***************************************************************
    当页码和页面记录数发生变化时监控后台查询
    如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。 
    ***************************************************************/
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', selectProfile);

    $scope.showInfo = function (val){
    	console.info(val);
        
        $scope.entrys=val;
        
        ngDialog.open({
       	    showClose: false,
            template: 'tpls/detail.html',
            className: 'ngdialog-theme-plain',
            width: 650,
            scope: $scope,
            cache: false,
            data:{isUpdate:false,title:'详情'}
        });
    }
});














