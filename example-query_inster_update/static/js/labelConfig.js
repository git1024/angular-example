$(function($) {
	loadSchedule();//该方法放在最上面执行
	//新增弹出层
	$("#addBtn").click(function(){
			addOrUpdate();
	});
	
	//点击关闭按钮的时候，遮罩层关闭
	$(".close").click(function () {
		$("#bg,.pop_box").css("display", "none");
		});
	});
//	$("#addTabBtn").click(function(){
//		$("#bg").css({
//		    display: "block", height: $(document).height()
//		});
//		var $box = $('#addtab.pop_box');
//		$box.css({
//		    //设置弹出层距离左边的位置
//		    left: ($("body").width() - $box.width()) / 2 - 20 + "px",
//		    //设置弹出层距离上面的位置
//		    //top: ($(window).height() - $box.height()) / 2 + $(window).scrollTop() + "px",
//		    top: 0 + "px",
//		    display: "block"
//		});
//	})

// 日夜班tab切换
	function registerTabLister(clickdom){
		$('#nav a').removeClass('selected');
		$(clickdom).addClass('selected');
		var scheduldId = $(clickdom).attr('_schedule_id');
		var domain = $(clickdom).attr('_domain');
		$("#domainid").val(domain);
		if(scheduldId!=1&&scheduldId!=2){
			$(".date").hide();
		}else{
			$(".date").show();
		}
		loadList();
	}

	$("#scheduleBtn").click(function(){
		var dayStart = $('#白班_start').val();
		var dayEnd = $('#白班_end').val();
		var nightStart = $('#夜班_start').val();
		var nightEnd = $('#夜班_end').val();
		if(dayStart.length==0 || dayEnd.length==0 || nightStart.length==0 || nightEnd.length==0 ){
			alert('请正确填写排班班时间');
		}
		
		if(dayStart!=nightEnd){
			alert('白班的开始时间必须与夜班的结束时间一致');
			return false;
		}
		if(dayEnd!=nightStart){
			alert('白班的结束时间必须与夜班的开始时间一致');
			return false;
		}
		var daySchedule = new Object(); 
		daySchedule.id = $('#白班_start').parent('span').attr("_schedule_id");
		daySchedule.startTime = dayStart; 
		daySchedule.endTime = dayEnd; 
		updateSchedule(daySchedule);
		
		var nightSchedule = new Object(); 
		nightSchedule.id = $('#夜班_start').parent('span').attr("_schedule_id");
		nightSchedule.startTime = nightStart; 
		nightSchedule.endTime = nightEnd; 
		updateSchedule(nightSchedule);
		alert("更新排班时间成功");
	});

	$("#depts").change(function(){
		var deptCode = $(this).val();
		//ajax获取数据
		var url = "/labelConfig/doctor/dept/"+deptCode;
		$("._dxlist").html('');
		$.getJSON(url, function(data){
			 var doctors = '';
			 $.each(data, function(i,item){
				 //"doctorId":13421730900,"name":"徐志华"
				 var exist = $("._yxlist a[_id='"+item.doctorId+"']").length;
				 doctors+='<a class="'+(exist>0?"tag-a":"tag-b")+'" _id="'+item.doctorId+'" href="javascript:void(0);">'+item.name+'</a>';
			 });
			 $("._dxlist").html(doctors);
			 dxclick();
		});
	});
	
	//提交事件
	$("#addlabel ._submit").click(function(){
		var labelName = $('#labelName').val();
		if(labelName.length<2){
			alert('请正确输入标签名，至少输入两个字符');
			return false;
		}
		var status = $('#status').val();
		var effort = $('#effort').val();
		var domain = $("#domainid").val();
		if(parseInt(effort)!=effort || effort<1 || effort>100)
		{
			alert('请正确输入权重，必须是1至100的整数');
			return false;
		}
	
		var id = $('#labelOperationId').val();
		var doctorIds = '';
		$("._yxlist a").each(function(){
			if(doctorIds.length>0){
				doctorIds+=',';
			}
			doctorIds+=$(this).attr('_id');
		});
		
		if(doctorIds.length<=0){
			alert('请选择排班的医生');
			return false;
		}
		
		var labelOperation = new Object(); 
		labelOperation.id = id;
		labelOperation.name = labelName; 
		labelOperation.status = status; 
		labelOperation.effort = effort; 
		labelOperation.doctorIds = doctorIds; 
		labelOperation.scheduleId = $("#labelScheduleId").val();
		labelOperation.domain = domain;
		//在修改或添加疾病标签时,默认为5条医生,若少于5条则提示客户
		var docNum = doctorIds.split(',').length;
		if(labelOperation.scheduleId==3&&docNum<=5){
			var resu=confirm("共选择了"+docNum+"个医生,是否确认提交?");
			if(resu!=true){
				return false;
			}
		}
		$.ajax({ 
            type:"POST", 
            url:"/labelConfig/label/addOrUpdate", 
            dataType:"json",      
            contentType:"application/json",               
            data:JSON.stringify(labelOperation), 
            success:function(data){ 
            	if(data.flag!=1){
            		alert(data.msg);
            	}else{
            		$("#bg,.pop_box").css("display", "none");
            		loadList();
            	}        
            	
            } 
         }); 
		
		$('._schedule').blur(function(){
			//$(this)
		});
});
	
//	$("#addtab ._submit").click(function(){
//		var tabname = $("#tabname").val();
//		if(!(tabname.length>=1)){
//			alert("请输入tab名");
//			return;
//		}
//		var domain = $("#domainname").val();
////		var regex = \[a-z|A-Z]+\
//		if(!(domain.length>=1)){
//			alert("请输入别名");
//			return;
//		}
//		$.ajax({
//			type:'POST',
//			url:'/labelConfig/schedule/add',
//			dataType:'json',
//			contentType:"application/json",
//			data:"{\"name\":\""+tabname+"\",\"domain\":\""+domain+"\"}",
//			success:function(data){
//				if(data.flag==1){
//					alert("保存成功");
//				}else{
//					alert(data.msg);
//				}
//			}
//		})
//		
//	});
	
var	globalListData;
function addOrUpdate(data) {
	if(data && data.id>0){
		$('#_title').html('修改标签');
		$('#labelName').val(data.name);
		$('#effort').val(data.effort);
		$('#status').val(data.status);
		$('#labelScheduleId').val(data.scheduleId);//修改时scheduleId从数据库读取而来
		var yxlist = '';
		for(j in data.doctorInfoList){
			yxlist+='<a class="tag-a" href="javascript:void(0);" _id="'+data.doctorInfoList[j].doctorId+'">'+data.doctorInfoList[j].name+'</a>';
		}
		$('._dxlist').html('');
		$('._yxlist').html(yxlist);
		$('#labelOperationId').val(data.id);
	}else{
		if($('#nav li a[class="selected"]').attr('_schedule_id')=='6'&&globalListData.length>=1){
			alert("心理咨询标签已存在,不能添加");
			return;
		}
		$('#_title').html('新增标签');
		$('#labelName').removeAttr('disabled').val('');
		$('#effort').val('');
		$('#status').val(1);
		$('._dxlist').html('');
		$('._yxlist').html('');
		$('#labelOperationId').val(-1);
		$('#labelScheduleId').val($('#nav li a[class="selected"]').attr('_schedule_id'));//添加时从页面获取当前的scheduleId
	}
	
	getDepts();
	dxclick();
	yxclick();
	
	$("#bg").css({
	    display: "block", height: $(document).height()
	});
	var $box = $('#addlabel.pop_box');
	$box.css({
	    //设置弹出层距离左边的位置
	    left: ($("body").width() - $box.width()) / 2 - 20 + "px",
	    //设置弹出层距离上面的位置
	    //top: ($(window).height() - $box.height()) / 2 + $(window).scrollTop() + "px",
	    top: 0 + "px",
	    display: "block"
	});
}

//待选医生效果
function dxclick(){
	$("._dxlist a").unbind("click");
	$("._dxlist a").click(function () {
		if($(this).hasClass("tag-b")){//添加操作
			$(this).removeClass('tag-b');
			$(this).addClass('tag-a');
			addDoctor($(this).clone());
		}else{//删除操作
			$(this).removeClass('tag-a');
			$(this).addClass('tag-b');
			var _id = $(this).attr("_id");
			$("._yxlist a[_id='"+_id+"']").remove();
		}
	});
}

function updateSchedule(schedule){
	
	$.ajax({ 
	    type:"POST", 
	    url:"/labelConfig/schedule/update", 
	    dataType:"json",      
	    contentType:"application/json",               
	    data:JSON.stringify(schedule), 
	    success:function(data){ 
	    	if(data.flag!=1){
	    		alert(data.msg);
	    	}
	    }        
	 }); 
}

//已选医生效果
function yxclick(){
	$("._yxlist a").unbind("click");
	$("._yxlist a").click(function () {
		$(this).remove();
		var _id = $(this).attr("_id");
		$("._dxlist a[_id='"+_id+"']").removeClass('tag-a').addClass('tag-b');
	});
}

function addDoctor(obj){
	obj = $(obj);
	$("._yxlist").append(obj);
	yxclick();
	
}

function loadSchedule(){
	var url = "/labelConfig/loadschedules?status=1";
	$.getJSON(url, function(data){
		if(data.success==false){
			alert(data.error);
		}else{
			$("#nav").empty();
			 $.each(data, function(i,item){
				 //<li><a href="javascript:void(0);" class="selected" _scheduleId_id=''>白班</a></li>
				$('#'+item.name+'_start').val(item.startTime);
				$('#'+item.name+'_end').val(item.endTime).parent().attr('_schedule_id',item.id);
				var lihtml = "<li><a href=\"javascript:void(0);\" onclick='registerTabLister(this)' _schedule_id='"+item.id+"' _domain='"+item.domain+"''>"+item.name+"</a></li>"
				$("#nav").append(lihtml);
			 });
			 $("#nav li:first a").attr('class','selected');
			 registerTabLister($("#nav li:first a"));
			 loadList();
			 
		}
	});
}
function loadList(){
	var url = "/labelConfig?scheduleId="+$('#nav li a[class="selected"]').attr('_schedule_id');
	$.getJSON(url, function(data){
		  $("#titleTr").siblings().remove();
		  var trs = '';
		  $.each(data, function(i,item){
			  trs+='<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.effort+'</td>';
			  trs+='<td>'+(item.status == 1?'上架':'下架')+'</td>';
			  trs+='<td class="lf"><p>';
			  for(j in item.doctorInfoList){
				  trs+='<a class="tag-a" href="javascript:void(0);">'+item.doctorInfoList[j].name+'</a>';
			  }
			  trs+='</p></td>';
			  trs+='<td style="font-size:14px"><a href="javascript:void(0);" onclick="edit('+i+');">修改</a></td></tr>';
		  });
		  $("#titleTr").after(trs);
		  globalListData = data;
		});
}

function edit(index){
	addOrUpdate(globalListData[index]);
}

//获取擅长科室
function getDepts(){
	var url = "/labelConfig/depts";
	$("#depts").html('');
	$.getJSON(url, function(data){
		  var options = '<option value="-1">请选择</option>';
		  $.each(data, function(i,item){
			  //deptCode deptName isShow
			  options+='<option value="'+item.deptCode+'">'+item.deptName+'</option>';
		  });
		  $("#depts").html(options);
		});
}
