var departmentApp = angular.module("spuidApp",[]);
departmentApp.controller('spuidControl',function($scope,$http){
	$scope.loadinfo = function(){
		var uid = $scope.id;
		if(parseInt(uid)!=uid ){
			alert("请输入整数的商品id");
			return;
		}
		$scope.singleSearch=true;
		$("#loading").show();
		$http({
			url:"/spuid/loadsingle?id="+uid,
			type:'get',
		}).success(function(data){
//			$scope.id = data.id;
			$scope.fpname = data.fpname;
			$scope.kinddetail = data.kinddetail;
			$scope.labeltdetail = data.labeltdetail;
			$("#loading").hide();
			$scope.singleSearch=false;
		}).error(function(){
			$("#loading").hide();
			$scope.singleSearch=false;
			alert("系统异常");
		});
	};
	
})