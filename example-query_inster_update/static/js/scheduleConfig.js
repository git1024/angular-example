var tabapp = angular.module("tabApp",[]);
tabapp.controller('tabsCtrl',function($scope,$http,tabService,updateService,addService){
	tabService.loadList($scope,$http);
	$scope.beforeaddTab=function(){
		//1.修改对话页面标签
		$scope.operatorTab = '添加Tab';
		$scope.operater = 'addTab';
		//2.清空对话框内容
		$scope.tabName='';
		$scope.domain='';
		$scope.tabId='';
		$scope.disableDomain=false;
		
	};
	
	$scope.beforeupdateTab=function(id){
		//1.修改对话页面标签
		$scope.operatorTab = '编辑Tab';
		$scope.operater = 'updateTab';
		$scope.disableDomain=true;
		//2.加载数据
		$http({
			method:'get',
			url:"/labelConfig/schedule/load?id="+id,
		}).success(function(data){
			$scope.tabName=data.name;
			$scope.domain=data.domain;
			$scope.tabId=data.id;
		});
	};
	
	$scope.operateTab = function(){
		if($scope.operater=='updateTab'){
			updateService.updateLabel($scope,$http);
		}else{
			addService.addLabel($scope,$http);
		}
	};
	
	$scope.shiftoperater = function(id,status){
		var conf = confirm("确定修改Tab状态?修改后对应的所有医生标签也将发生响应变化!");
		if(conf){
			$http({
				method:'get',
				url:'/labelConfig/tab/update?scheduleId='+id+'&status='+status,
			}).success(function(data){
				if(data.success==false){
					alert(data.error);
				}else if(data.flag==1){
					$("#tabModel").modal('hide');
					alert(data.msg);
					tabService.loadList($scope,$http);
				}else{
					alert(data.msg);
				}
			}).error(function(){
				alert("系统异常");
			});
		}
		
	}
});

tabapp.service('tabService',function(){
		this.loadList=function($scope,$http){
			$http({
				method:'get',
				url:"/labelConfig/schedule",
				}).success(function(data){
						$scope.tabs=data;
					});
		};
		
	});
	
tabapp.service('addService',function(tabService){
		this.addLabel=function($scope,$http){
			var name=$scope.tabName;
			var domain=$scope.domain;
			if(name==null||name==''){
				alert("请输入Tab名称");
				return;
			}
			var conf = confirm("确定添加Tab页?");
			if(conf){
			$http({
				method:'post',
				url:'/labelConfig/schedule/add',
				data:{
					"name":name,
					"domain":domain,
//					"status":$scope.labelStatus,
				}
			}).success(function(data){
				if(data.success==false){
					alert(data.error);
				}else if(data.flag==1){
					$("#tabModel").modal('hide');
					alert(data.msg);
					tabService.loadList($scope,$http);
				}else{
					alert(data.msg);
				}
			}).error(function(){
				alert("系统异常");
			});
			}
		};
	})
	
	tabapp.service('updateService',function(tabService){
		this.updateLabel=function($scope,$http){
			var name=$scope.tabName;
			if(name==null||name==''){
				alert("请输入Tab名");
				return;
			}
			$http({
				method:'post',
				url:'/labelConfig/schedule/update',
				data:{
					"id":$scope.tabId,
					"name":name,
				}
			}).success(function(data){
				if(data.success==false){
					alert(data.error);
				}else if(data.flag==1){
					$("#tabModel").modal('hide');
					alert(data.msg);
					tabService.loadList($scope,$http);
				}else{
					alert(data.msg);
				}
			}).error(function(){
				alert("系统异常");
			});
		};

	})
	