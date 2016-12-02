$(function(){

	var labelNodes = [];
	$.ajax({
		url:"/baseLabel/labelList",
		type:"get",
		success:function(data){
			labelNodes = data.t;
		}
	});
	
	$("#deleteLabel").on("click",function(){
		
		
	})
	
    var labelVectors = [
            {
                id: 0,
                name: "点评网",
            },
            {
                id: 1,
                name: "测试",
            }
            ];
	var labelNodeId="";
	var labelVectorId="";
	var labelVectorNodeId=""
	//标签节点检索，下拉列表显示检索内容
$("#labelNode-search").on('click',function(){
		var dataSet = [];
		seachLabel=$("#labelNode-search").val();
	    if(seachLabel){
		  for(var i=0,length=labelNodes.length;i<length;i++){
            var item = labelNodes[i];
            if(item.name.indexOf(seachLabel)!==-1){
                dataSet[dataSet.length] = dropdownMode(item.id, item.name);
              }
            }
           }else {
           	for(var i=0,length=labelNodes.length;i<length;i++){
            var item = labelNodes[i];
            dataSet[dataSet.length] = dropdownMode(item.id, item.name);
            }  
         }
		$('#labelNode-info-aly').html(dataSet.join(''));
	
	})
	//将选中内容复制给标签框
$("#labelNode-info-aly").on('click','li',function(){
	
	labelNodeId = this.getAttribute('data-id'); //获取选中的标签id
	var txt=this.innerText;
	$("#labelNode-search").val(txt);
})

	//Domain检索，下拉列表显示检索内容
$("#labelVector-search").on('click',function(){
		var dataSet = [];
		seachLabel=$("#labelVector-search").val();
	    if(seachLabel){
		  for(var i=0,length=labelNodes.length;i<length;i++){
            var item = labelNodes[i];
            if(item.name.indexOf(seachLabel)!==-1){
                dataSet[dataSet.length] = dropdownMode(item.id, item.name);
              }
            }
           }else {
           	for(var i=0,length=labelNodes.length;i<length;i++){
            var item = labelNodes[i];
            dataSet[dataSet.length] = dropdownMode(item.id, item.name);
            }  
         }
		$('#labelVector-info-aly').html(dataSet.join(''));
	
	})
	//将选中内容复制给标签框
$("#labelVector-info-aly").on('click','li',function(){
	
	labelVectorId = this.getAttribute('data-id'); //获取标签关系id
	var txt=this.innerText;
	$("#labelVector-search").val(txt);
})


	//Domain检索，下拉列表显示检索内容
$("#labelVectorNode-search").on('click',function(){
		var dataSet = [];
		seachLabel=$("#labelVectorNode-search").val();
	    if(seachLabel){
		  for(var i=0,length=labelNodes.length;i<length;i++){
            var item = labelNodes[i];
            if(item.name.indexOf(seachLabel)!==-1){
                dataSet[dataSet.length] = dropdownMode(item.id, item.name);
              }
            }
           }else {
           	for(var i=0,length=labelNodes.length;i<length;i++){
            var item = labelNodes[i];
            dataSet[dataSet.length] = dropdownMode(item.id, item.name);
            }  
         }
		$('#labelVectorNode-info-aly').html(dataSet.join(''));
	
	})
	//将选中内容复制给标签框
$("#labelVectorNode-info-aly").on('click','li',function(){
	
	labelVectorNodeId = this.getAttribute('data-id'); //获取标签关系id
	var txt=this.innerText;
	$("#labelVectorNode-search").val(txt);
	var existFlag =false;
	$.each(vectorIds,function(index,vid){
		if(vid==labelVectorNodeId){
			alert("此标签已添加");
			existFlag = true;
			return false;
		}
	})
	if(!existFlag){
		$('#labelVectorNode-list').append(tplInfoLVNode(labelVectorNodeId, txt));  //将选中标签放入列表框中
	}
})

 //显示框标签删除
$("#labelVectorNode-list").on('click','.glyphicon',function(){
	
	
	this.parentElement.remove();  
	
})
   
})
	

 //下拉模板
function dropdownMode (itemId, itemName) {	
    return '<li role="presentation" data-id="itemID"><a role="menuitem" tabindex="-1" href="#">itemName</a></li>'.replace(/itemName/g, itemName).replace(/itemID/g, itemId);
}

//标签显示模板
function tplInfoLVNode (itemId, itemName) {
	console.log(itemId);
	console.log(itemName);
    return '<li>itemName<span class="glyphicon glyphicon-minus" data-id="itemID"></span></li>'.replace(/itemName/g, itemName).replace(/itemID/g, itemId);
}
   
