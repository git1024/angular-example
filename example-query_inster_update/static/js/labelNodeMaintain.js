
$(function(){
	findlabel();
    //新增标签节点保存
    $("#label-save").on('click',function(){saveLabel()});
    
    //关闭模态框时，清楚模态框数据
   $("#labelNodeMode").on("hidden", function() {  
   	$(this).removeData("modal");  
   	});
   

    
    /*修改模态框加载数据*/
    $("#modifyLabelNode").on('click',function(){
    	var data = this.parent("tr");
    	console.log(data);
    	
    	
    })
    //标签节点更新
    $("#label-update").on('click',function(){
    	var id=$("#edit-labelNodeMode #id").val();
    	var name=$("#edit-labelNodeMode #name").val();
    	var type = $("#edit-labelNodeMode #type").val();
    	if(name==null||name.trim()==''){
    		alert("标签名称不能为空");
    		return;
    	}
    	if(type==null||type==0){
    		alert("请选择标签类型");
    		return;
    	}
    	$.ajax({
    		url:"/baseLabel/labelUpdate",
    		type:"POST",
    		dataType:"json",
    		data:JSON.stringify({"id":id,"name":name,"type":type}),
    		contentType: "application/json",
    		success:function(data){
    			if(data.success){
    				alert("修改成功");
    				$('#edit-labelNodeMode').modal('hide');
    				$("#label-find").click();
    			}else{
    				alert(data.msg);
    			}
    		}
    	})
    });

    //标签节点数据查询
    $("#label-find").on('click',function(){findlabel()});
    //标签节点数据删除
    $("#deleteLabel").on('click',function(){
    	var id = $("input[name='labelradio']:checked").val();
//    	alert(id);
    	if(confirm("确定删除此节点以及依赖关系?")){
    		$.ajax({
    			url:'/baseLabel/labelRemove',
    			type:'get',
    			data:{"labelId":id},
    			success:function(data){
    				if(data.success){
    					alert("删除成功");
    					findlabel();
    				}else{
    					alert(data.msg);
    				}
    			}
    		})
    	}
    });

    //表单数据清空
    $("#label-clear").on('click',function(){
    	document.getElementById("name").value="";
    	document.getElementById("type").value="0";
    });
  
   


})
  
    //通过id查找标签id
function searchLabelById(labelId){
	$("#labelNodeData").children().remove();   /*清除表格数据*/
$.get(
    "/baseLabel/labelSimple",
    {
        id: labelId
    },
     labelNodeTemp(data.t));    	
};



  //处理表格模板
    function labelNodeTemp(data){
        var htmlStr ="";
        for(var i= 0;i<data.length;i++){
            htmlStr = htmlStr+"<tr><td style='width: 40px'><label><input type='radio' name='labelradio' value="+data[i].id+" class='ace'><span class='lbl'></span></label></td>";
            htmlStr = htmlStr+"<td>"+(i+1)+"</td><td>"+data[i].id+"</td><td>"+data[i].name+"</td><td>"+data[i].type+"</td><td>"+data[i].inWeight+"</td><td>"+data[i].outWeight+"</td>";
            htmlStr = htmlStr+"<td><a id='modifyLabelNode' href='javascript:findlabelwithid("+data[i].id+")'><span class='icon-edit'>编辑</span></a></td><tr>"
        }
        $("#labelNodeData tbody").html(htmlStr);
    };
    
  function findlabelwithid(id){
	  $.get(
				"/baseLabel/labelSimple",
		    {
					labelId:id
		    },
		    function(data){
		    	if(data.success){
			    	$('#edit-labelNodeMode').modal('show');
			    	var labelNode=data.t;
			    	$("#edit-labelNodeMode #id").val(labelNode.id);
			    	$("#edit-labelNodeMode #name").val(labelNode.name);
			    	$("#edit-labelNodeMode #type").val(labelNode.type);
		    	}
		       }
			);
  }

function findlabel(){
	name = $("#name").val();
	type = $("#type").val();
	if(type==null||type==0){
		type=null;
	}else{
		type = type.trim();
	}
	if(name!=null){
		name=name.trim();
	}
	$.get(
		"/baseLabel/labelList",
    {
        name: name,
        type: type
    },
    function(data){
    	var labelNode=data.t;   
    	//console.log(labelNode);
    	 if(labelNode){
        labelNodeTemp(labelNode);
       }
    else
       {
        alert("暂时没有标签数据");
       }
    }
	);
}


function saveLabel(){
	var name = $("#labelNodeMode #name").val();
    var type = $("#labelNodeMode #type").val();
	if(name==null||name.trim()==''){
		alert("请输入标签名称");
		return ;
	}
	if(type==0){
		alert("请选择类型");
		return;
	}
    $.ajax({
        url: '/baseLabel/labelSave',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({"name":name,"type":type}),
        timeout: 1000,
        contentType: "application/json",
        error: function () {
            alert('保存失败');
        },
        success: function (data) {
        	if(data.success){
        		alert("保存成功");
        		$('#labelNodeMode').modal('hide');
        		$("#label-find").click();
//        		searchLabelById(id);  /*通过id查找标签*/
        	}else{
        		alert(data.msg);
        	}
        }
    });

 return false;
}