var ext = ext || {};
/**
 * 扩展validatebox，添加新的验证功能
 * 
 * @author yaoyuanliang
 * 
 * @requires jQuery,EasyUI
 */
$.extend($.fn.validatebox.defaults.rules, {
	/* 验证两次密码是否一致功能 
	 * example:	validType="equals['#pwd']" 
	 */
	eqPwd : {
		validator : function(value, param) {
			return value == $(param[0]).val();
		},
		message : '密码不一致！'
	},
	/* 最小长度 
	 * example: data-options="validType:'minLength[5]'"
	 */
	minLength: {    
        validator: function(value, param){    
            return value.length >= param[0];    
        },    
        message: '请输入最少5个字符。'   
    },
    number:{
    	 validator: function(value, param){
    	 	
            return value.length >= param[0];    
        },    
        message: '请输入数字'   
    },
    //移动手机号码验证
    mobile: {//value值为文本框中的值
        validator: function (value) {
            var reg = /^1[3|4|5|8|9]\d{9}$/;
            return reg.test(value);
        },
        message: '输入手机号码格式不准确.'
    },
  	//验证邮编  
  	zipcode: {
        validator: function (value) {
            var reg = /^[1-9]\d{5}$/;
            return reg.test(value);
        },
        message: '邮编必须是非0开始的6位数字.'
    },
    // 验证身份证
 	idcard : {
        validator : function(value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message : '身份证号码格式不正确'
    },
 	// 验证电话号码
 	phone : {
        validator : function(value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message : '格式不正确,请使用下面格式:020-88888888'
    },
    // 验证QQ,从10000开始
 	qq : {
        validator : function(value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message : 'QQ号码格式不正确'
    },
	 // 验证整数
 	integer : {
        validator : function(value) {
            return /^[+]?[1-9]+\d*$/i.test(value);
        },
        message : '请输入整数'
    },
 	// 验证传真
 	faxno : {
        validator : function(value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message : '传真号码不正确'
    },
 	// 验证之只能输入英文
 	enstr : {
        validator : function(value) {
            return /^([u4e00-u9fa5]|[ufe30-uffa0]|[a-za-z0-9_])*$/i.test(value);
        },
        message : '只能输入英文'
    },
 	// 验证之只能输入中文
 	zhstr : {
        validator : function(value) {
            return /^[u4E00-u9FA5]+$/i.test(value);
 	       },
        message : '只能输入中文'
    },
    // 验证是否包含空格和非法字符 
    unnormal : {
        validator : function(value) { 
            return /.+/i.test(value); 
        }, 
        message : '输入值不能为空和包含其他非法字符' 
    }, 
    // 验证用户名 
    username : {
        validator : function(value) { 
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value); 
        }, 
        message : '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）' 
    }, 
	//时间区间验证
    isAfter: {
	    validator: function(value, param){
	        var dateA = $.fn.datebox.defaults.parser(value);
	        var dateB = $.fn.datebox.defaults.parser($(param[0]).datebox('getValue'));
	        return dateA>new Date() && dateA>dateB;
	    },
	    message: '结束时间不能小于开始时间'
    } ,
    isLaterToday: {
	    validator: function(value, param){
	        var date = $.fn.datebox.defaults.parser(value);
	        return date>new Date();
	    },
	    message: '开始时间不能小于今天'
    },

	
   /*	ajax 验证唯一性
    * 例子：验证手机号唯一
	*		1.数据库设计时mobile字段使用唯一键（UNIQUE）
	*		2.前端用法
	*		<input type="text" name="user_name" id="username" class="easyui-validatebox" 
	*				required="true" 
	*				validType="Unique_validation[/^1[3|4|5|8|9]\d{9}$/,
	*											'输入手机号码格式不准确',
	*											'Member/Index/checkusername',
	*											'name',
	*											'该手机号已经存在']" 
	*				missingMessage="请输入手机！"/>
	*	
	*	Unique_validation 有5个参数
	*	第一个参数：JS正则表达式 ，
	*	第二个：正则验证返回的错误提示，
	*	第三个参数：服务器端验证URL，
	*	第四个参数：post传递的参数，
	*	第五个服务器端验证返回的无错提示
	*	说明：第一个参数不需要用单引号引起来,EASYUi 中有默认的AJAX远程验证方法，用法：
	*	<input type="text"name="user_name" validtype="remote['url'，'name']"invalidMessage="用户名已存在"/>
	*	这个用法有一点不好就是每输入一次就会发送数据到服务器验证一次，而且这个方法最不好的地方就是不能验证 字段的格式是否正确，
	*	而EASYUI 中的validatebox不能组合验证（既要验证格式是否正确，又要验证是否唯一），而上面那个AJAX扩展就能做到
    */
 	unique_validation: {  
            validator: function(value, param) { 
                var m_reg = new RegExp(param[0]); //传递过来的正则字符串中的"\"必须是"\\"  
                if (!m_reg.test(value)) {  
                    $.fn.validatebox.defaults.rules.Unique_validation.message = param[1];  
                    return false;  
                }else{  
                    var postdata = {};  
                    postdata[param[3]] = value;  
                    var result = $.ajax({  
                        url: param[2],  
                        data: postdata,  
                        async: false,  
                        type: "post"  
                    }).responseText;  
                    if (result == "false") {  
                        $.fn.validatebox.defaults.rules.Unique_validation.message = param[4];  
                        return false;  
                    }else{  
                        return true;  
                    }  
                }  
            },  
            message: ''  
        } 


});




























