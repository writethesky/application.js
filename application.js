/**
 * application.js v1.0
 * https://github.com/writethesky
 * https://github.com/writethesky/application.js
 */
(function(w){
	
	var t = '?t=' + (new Date()).getTime();
	
	/**
	 * api 相关
	 */
	w.api = {
		host: "http://139.224.54.221:8002/",
//		host: "http://192.168.199.10:8002/",
		version: "v1",
	}
	w.api.url = w.api.host + w.api.version;
	w.api.get = function(url, callback){

		
		$.ajax({
			type:"get",
			url:w.api.url + "/" + url,
			dataType: 'json',
			async:true,
			xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data){
            	callback(data);
            }
		});
	}
	w.api.post = function(url,arr,callback){
		$.ajax({
			type:"post",
			data: arr,
			url:w.api.url + "/" + url,
			dataType: 'json',
			async:true,
			xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data){
            	callback(data);
            }
		});
	}
	
	
	/**
	 * 返回
	 */
	w.apphistory = [];

	w.back = function(){
		var prev_page_index = w.apphistory.length - 2;
		if(prev_page_index < 0){
			return;
		}
		
		var prev_page_data = w.apphistory[prev_page_index];
		
		load_page(null, prev_page_data);
		w.apphistory.pop();
		w.apphistory.pop();
		
	}


	w.alert.alert_message = function(msg, m_width, m_height, m_loop_time, m_type){
		
		m_width = m_width ? m_width : '100%';
		m_height = m_height ? m_height : '2rem';
		m_loop_time = m_loop_time ? m_loop_time : 500;
		m_id = 'alert_' + (new Date()).getTime();
		
		b_height = $(window).height();
		var l_top = b_height / 2;


		
		var m_background_color = "rgb(255, 116, 116)";
		switch(m_type){
			case 'error':
				m_background_color = "rgb(255, 116, 116)";
				break;
			case 'success':
				m_background_color = "#65e26e";
				break;
			default:
				m_background_color = "rgb(255, 116, 116)";
				break;
		}
		var dom = $("<div />").css({
			width: m_width,
			height: m_height,
			background: m_background_color,
			position: 'fixed',
			color: "#fff",
			textAlign: 'center',
			lineHeight: m_height,
			top: b_height
		}).attr('id', m_id).text(msg);
		
		$("body").append(dom);
		
		
		dom.animate({'top': l_top}, m_loop_time);
		
		
		setTimeout(function(){
			dom.remove();
		}, m_loop_time + 2000);

		
	}
	
	
	w.alert.error = function(msg, m_width, m_height, m_loop_time){
		w.alert.alert_message(msg, m_width, m_height, m_loop_time, 'error');
	}
	w.alert.success = function(msg, m_width, m_height, m_loop_time){
		w.alert.alert_message(msg, m_width, m_height, m_loop_time, 'success');
	}

	
	
	$("html").on("click", "a", load_page);
	
	function load_page(_this, page_data){
		
		
		
		
		
		
		
		if(page_data){
			var dataHref = page_data.html;
			var dataId = page_data.container_id;
			var dataCss = page_data.css;
			var dataJs = page_data.js;
			
			var dataObj = page_data.obj;
		}else{
			var dataHref = $(this).attr("data-href");
			var dataId = $(this).attr("data-id");
			var dataCss = $(this).attr("data-css");
			var dataJs = $(this).attr("data-js");
			
			var dataObj = $(this).attr("data-obj");
			if(dataObj){
				dataObj = dataObj.replace(/'/g, '"');
				
				(dataObj = $.parseJSON(dataObj));
				w.dataObj = dataObj;
			}
			dataCss = dataCss ? dataCss.split("|") : "";
			dataJs = dataJs ? dataJs.split("|") : "";
		}
		
		
		var page_data = {
			html: dataHref,
			css: dataCss,
			js: dataJs,
			container_id: dataId,
			obj: dataObj
		};

		w.apphistory.push(page_data);
		
		dataHref && load.html(dataHref, dataId, function(){
			
			dataCss && load.css(dataCss, function(){
				
				dataJs && load.js(dataJs);
			});
		});
	}
	
	function load(){
		
		this.html = function(url, id, callback){
			
			$.get(url + t, function(data){
				$("#" + id).html(data);
				callback && callback();
			});
		}
		
		this.css = function(arr, callback){
			
			for(i in arr){
				
				var href = 'public/css/' + arr[i] + t;
				var head = document.getElementsByTagName('HEAD').item(0);
				var is_run = true;
				$("link").each(function(){
		
					var tmp = window.location.href.split("/");
					var end_length = tmp[tmp.length - 1].length;
		
					var complete_href = (window.location.href.substr(0, window.location.href.length - end_length) + href);

					if(complete_href == this.href){
						is_run = false;
					}
				});
				
				if(is_run){
					var style = document.createElement('link');
					style.href = href;
					style.rel = 'stylesheet';
					style.type = 'text/css';
					head.appendChild(style);
					
				}
				
			}
			callback && callback();
		}
		
		this.js = function(arr, callback){
//			console.log(arr);
			for(i in arr){
				var src = 'public/js/' + arr[i] + t;
				var body = document.getElementsByTagName('body').item(0);
				var is_run = true;
				$("script").each(function(){
		
					var tmp = window.location.href.split("/");
					var end_length = tmp[tmp.length - 1].length;
		
					var complete_src = (window.location.href.substr(0, window.location.href.length - end_length) + src);

					if(complete_src == this.src){
						is_run = false;
						
					}
				});
				if(is_run){				
					var script = document.createElement('script');
					script.src = src;
					script.type = 'text/javascript';
					body.appendChild(script);
				}else{
					var js_name = arr[i];
//					console.log(js_name);
					w[js_name] && w[js_name]();
				}
			}
			callback && callback();
		}
	}
	var load = new load();
	
	
	$('a').each(function(){
		if($(this).attr("checked")){
			load_page.call(this);
		}
	});
	
	//封装一个获取 时间格式为 yyyy/mm/dd  的方法
	w.getFormatDate = function(dateTmie){
		var myDate = new Date(dateTmie*1000);
		var yy = myDate.getFullYear();
		var mm = myDate.getMonth()+1;
		var dd = myDate.getDate();
		return yy + "/" + getTwo(mm) + "/" + getTwo(dd);
		//获取两位数
		function getTwo(num){
			if(num<10){
				return "0" + num;
			}else{
				return num;
			}
		}
	}
//导航切换 背景变色
	$(".left_bar li").click(function(){
		$(".left_bar li").css("background","transparent")
		$(this).css("background","#00bbe9");
	});
	
	//判断登陆  跳转登录页
	function check_login_status(){
		w.api.get('index/index', function(data){
			if(data.status == 0){
				window.location.href = "login.html";
			}
		});
		setTimeout(check_login_status, 10000);
	}
	var url = (window.location.href.split("/"));
	url = url[url.length - 1];
	(url == 'login.html') || check_login_status();

	
	
}(window));
