$(function(){
	bootload();//初始化数据
	
	//点击关闭按钮的时候，遮罩层关闭
	$(".close").click(function () {
		$("#bg,.pop_box").css("display", "none");
	});
	
	$("._submit").click(function(){
		var tag = $("#operate_tag").val();
		if(tag=='add'){
			addnode();
		}else{
			updatenode();
		}
	});
	//添加热词
	$("#addBtn").click(function(){
		//修改隐藏的操作符
		initdata();
		$("#operate_tag").val('add');
		showview();
	});
	
	$("#imageActionId").change(function(){
		$("#imageForm").submit();
	});
});

function bootload(){
	var url = "/expertDeptConfig";
	$.post(url,{
		"domain":"点评网",
		"catagory":"擅长科室"
	},function(data){
		var html="";
		$.each(data,function(index,item){
			if(index>=9){
				html+="<div style='height:40px;' id='"+item.id+"div'><span>擅长科室"+(index+1)+":</span>";
			}else{
				html+="<div style='height:40px;' id='"+item.id+"div'><span>擅长科室&nbsp;"+(index+1)+"&nbsp;:</span>";
			}
			html+="<span><input type='text' name='name' disabled='disabled' value='"+item.name+"'/></span>";
			html+="<span>权重:</span>";
			html+="<span><input type='text' name='effort' disabled='disabled' value='"+item.effort+"' /></span>";
			html+="&nbsp;&nbsp;<a class='link' href='javascript:void(0)' onclick='loadupdateData("+item.id+")'>编辑</a>";
//			html+="&nbsp;&nbsp;<a class='link' href='javascript:void(0)' onclick='deletenode("+item.id+")'>删除</a></div>";
			html+="</div>"
		});
		$("#showdata").empty();
		$("#showdata").append(html);
	},'json');
	
}

/**
 * 向弹出层的编辑框中加载数据
 */
function loadupdateData(id){
	var url="/expertDeptConfig/loadSimpleLabelOperation?modelId="+id;
	$.getJSON(url,function(data){
		$("#labelOperationId").val(data.id);
		$("#domainId").val(data.domain);
		$("#labelName").val(data.name);
		$("#effortId").val(data.effort);
		$("#tfsCode").val(data.bannerTFSCode)
		$("#labelImage").attr('src',data.tfsUrl);
	});
	$("#operate_tag").val('update');
	showview();
}

/**
 * 配置弹出框,以及显示弹出框
 */
function showview(){
	initdata();
	$("#bg").css({
	    display: "block", height: $(document).height()
	});
	var $box = $('.pop_box');
	$box.css({
	    //设置弹出层距离左边的位置
	    left: ($("body").width() - $box.width()) / 2 - 20 + "px",
	    //设置弹出层距离上面的位置
	    top: ($(window).height() - $box.height()) / 2 + $(window).scrollTop() + "px",
	    display: "block"
	});
}

/**
 * 提交添加或者编辑的数据
 */
function updatenode(){
	//获取热词权重
	var id = $("#labelOperationId").val();
	var effort =$("#effortId").val();
//	var domain=$("#domainId").val();
	var bannerTFSCode = $("#tfsCode").val();
	if(parseInt(effort)!=effort || effort<1 || effort>100){
		alert('请正确输入权重，必须是1至100的整数');
		return;
	}
	var url="/expertDeptConfig/updateLabelOperation";
	$.post(url,{
		"id":id,
		"effort":effort,
		"bannerTFSCode":bannerTFSCode
	},function(data){
		if(data.success==false){
			alert(data.error);
		}else if(data.flag!=1){
			alert(data.msg);
		}else{
			$(".close").click();
			bootload();
			initdata();
		}
	},'json');
}
/**
 * 删除热词标签
 */
function deletenode(id){
	var tag = confirm("确定要删除此热词?");
	if(tag){
		var url="/expertDeptConfig/deleteLabelOperation"
		$.get(url,{"labelOpId":id},function(data){
			if(data.success==false){
				alert(data.error);
			}else if(data.flag!=1){
				alert(data.msg);
			}else{
				bootload();
			}
		});
	}
	
}
/**
 * 添加热词
 */
function addnode(){
	var id = $("#labelOperationId").val();
	var effort =$("#effortId").val();
	var domain="点评网";
	var category="擅长科室";
	var bannerTFSCode = $("#tfsCode").val();
	var name=$("#labelName").val();
	if(parseInt(effort)!=effort || effort<1 || effort>100){
		alert('请正确输入权重，必须是1至100的整数');
		return;
	}
	var url="/expertDeptConfig/addLabelOperation";
	$.post(url,{
		"id":id,
		"name":name,
		"effort":effort,
		"bannerTFSCode":bannerTFSCode,
		"domain":domain,
		"category":category,
		"scheduleId":"1",
		"status":1
	},function(data){
		if(data.success==false){
			alert(data.error);
		}else if(data.flag!=1){
			alert(data.msg);
		}else{
			$(".close").click();
			initdata();
			bootload();
		}
	},'json');
}

function uploadSuccess(msg) {
    if (msg.split('|').length > 1) {
        $('#tfsCode').val(msg.split('|')[1]);
        alert(msg.split('|')[0]);
    } else {
        alert(msg);
    }
}

/**
 * 弹出框初始化数据
 */
function initdata(){
	$("#labelOperationId").val(-1);
	$("#effortId").val('');
	$("#labelName").val('');
	$("#operate_tag").val('update');
	$("#labelImage").removeAttr('src');
	$("#tfsCode").val('');
	$("#imageActionId").val('');
}




var app = angular.module('app',[]);
app.controller('UploaderController', function($scope,fileReader,$http){
	$scope.getFile = function () {
	    fileReader.readAsDataUrl($scope.file, $scope)
	                  .then(function(result) {
	                      $scope.imageSrc = result;
	                  });
		};
		
	});
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement||event.target).files[0];
                
                scope.getFile();
            });
        }
    };
}]);



app.factory('fileReader', ["$q", "$log", function($q, $log){
var onLoad = function(reader, deferred, scope) {
    return function () {
        scope.$apply(function () {
            deferred.resolve(reader.result);
        });
    };
};

var onError = function (reader, deferred, scope) {
    return function () {
        scope.$apply(function () {
            deferred.reject(reader.result);
        });
    };
};

var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    return reader;
};

var readAsDataURL = function (file, scope) {
    var deferred = $q.defer();
    var reader = getReader(deferred, scope);         
    reader.readAsDataURL(file);
    return deferred.promise;
};

return {
    readAsDataUrl: readAsDataURL  
};
}]);