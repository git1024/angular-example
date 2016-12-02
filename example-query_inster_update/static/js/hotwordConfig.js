var labelapp = angular.module("labelApp",[]);
	labelapp.controller('labelsCtrl',function($scope,$http,labelService,updateService,addService){
		//初始化数据
		$scope.labelDomain = "fastInquiry";
		$scope.labelCategory = "hotwordLabel";
		labelService.loadList($scope,$http);
		$scope.beforeaddLabel=function(){
			//1.修改对话页面标签
			$scope.operatorLabel = '添加热词';
			$scope.operater = 'addLabel';
			//2.清空对话框内容
			$scope.labelName='';
			$scope.labelWeight='';
			$scope.labelId='';
		};
		
		$scope.beforeupdateLabel=function(id){
			//1.修改对话页面标签
			$scope.operatorLabel = '编辑热词';
			$scope.operater = 'updateLabel';
			//2.加载数据
			$http({
				method:'get',
				url:"/hotwordConfig/loadSimpleLabelOperation?modelId="+id,
			}).success(function(data){
				$scope.labelName=data.name;
				$scope.labelWeight=data.effort;
				$scope.labelId=data.id;
				$scope.labelStatus=data.status;
			});
		};
		
		$scope.operateLabel = function(){
			if($scope.operater=='updateLabel'){
				updateService.updateLabel($scope,$http);
			}else{
				addService.addLabel($scope,$http);
			}
		};
		
		$scope.changeTab = function(tab){
			if(tab=='dianping'){
				$scope.labelDomain = "点评网";
				$scope.labelCategory = "热词";
			}else if(tab=='fastInquiry'){
				$scope.labelDomain = 'fastInquiry';
				$scope.labelCategory = "hotwordLabel";
			}
			labelService.loadList($scope,$http);
		}
		
	});

	labelapp.service('labelService',function(){
		this.loadList=function($scope,$http){
			$http({
				method:'post',
				url:"/hotwordConfig",
				data:{
					"domain":$scope.labelDomain,
					"category":$scope.labelCategory
				}}).success(function(data){
						$scope.labels=data;
					});
		};
	});
	
	labelapp.service('addService',function(labelService){
		this.addLabel=function($scope,$http){
			var name=$scope.labelName;
			var effort=$scope.labelWeight;
			if(name==null||name==''){
				alert("请输入热词名称");
				return;
			}
			if(parseInt(effort)!=effort || effort<1 || effort>100){
				alert('请正确输入权重，必须是1至100的整数');
				return;
			}
			
			$http({
				method:'post',
				url:'/hotwordConfig/addLabelOperation',
				data:{
					"name":name,
					"category":$scope.labelCategory,
					"domain":$scope.labelDomain,
					"status":$scope.labelStatus,
					"effort":effort
				}
			}).success(function(data){
				if(data.success==false){
					alert(data.error);
				}else if(data.flag==1){
					$("#labelModel").modal('hide');
					alert(data.msg);
					labelService.loadList($scope,$http);
				}else{
					alert(data.msg);
				}
			}).error(function(){
				alert("系统异常");
			});
		};
	})
	
	labelapp.service('updateService',function(labelService){
		this.updateLabel=function($scope,$http){
			var name=$scope.labelName;
			if(name==null||name==''){
				alert("请输入热词名称");
				return;
			}
			var effort = $scope.labelWeight;
			if(parseInt(effort)!=effort || effort<1 || effort>100){
				alert('请正确输入权重，必须是1至100的整数');
				return;
			}
			
			$http({
				method:'post',
				url:'/hotwordConfig/updateLabelOperation',
				data:{
					"id":$scope.labelId,
					"name":name,
					"effort":effort,
					"domain":$scope.labelDomain,
					"category":$scope.labelCategory,
					"status":$scope.labelStatus
				}
			}).success(function(data){
				if(data.success==false){
					alert(data.error);
				}else if(data.flag==1){
					$("#labelModel").modal('hide');
					alert(data.msg);
					labelService.loadList($scope,$http);
				}else{
					alert(data.msg);
				}
			}).error(function(){
				alert("系统异常");
			});
		};

	})
	