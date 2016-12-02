var myFilterModule = angular.module("MyFilterModule", []);
myFilterModule.filter('weight', function() { 
  return function(input) { 
	if(''==input | undefined==input){
		return "";
	}else{
		return input+" kg" 
	}  
   
  }; 
}); 
myFilterModule.filter('height', function() { 
	  return function(input) { 
		  if(''==input | undefined==input){
				return "";
			}else{
				return input+" cm" 
			} 
	  }; 
}); 
myFilterModule.filter('month', function() { 
	  return function(input) { 
		  if(''==input | undefined==input){
				return "";
			}else{
				return input+" 月" 
			} 
	  }; 
});
myFilterModule.filter('gender', function() { 
	  return function(input) { 
		  if(''==input | undefined==input){
				return "";
			}else{
				if(input=="0"){
					return "未知"
				}else if(input =="1"){
					return "男"
				}else if(input == "2"){
					return "女"
				}
			} 
	  }; 
});
myFilterModule.filter('marStatus', function() { 
	  return function(input) { 
		  if(''==input | undefined==input){
				return "";
			}else{
				if(input=="0"){
					return "未婚"
				}else if(input =="1"){
					return "已婚"
				}else if(input == "2"){
					return "未知"
				}
			} 
	  }; 
});
myFilterModule.filter('size', function() {
	  return function (items) {
	    if (!items)
	      return 0;

	    return items.length || 0
	  }
});
myFilterModule.filter('sequenceNum', function() {
	        
		   
	  return function (input,currentPage,itemsPerPage) {
		  		
		var pagesize = (currentPage-1)*itemsPerPage;
		return input+pagesize;
		  
	  }
});