/**
 * application.js v1.0
 * https://github.com/writethesky
 * https://github.com/writethesky/application.js
 */
(function(w){
	'use strict';

	//jQuery版本检测
	if(typeof($) == 'undefined' || typeof($.fn) == 'undefined' || typeof($.fn.jquery) == 'undefined' || $.fn.jquery < '3.1.1'){

		console.info("请引入3.1.1版本以上的jQuery");
		return;
	}

	if(!is_html5()){
		$("body").html("<h1>您的内核版本太低</h1><br /><br /><h3>如果您正在使用的浏览器访问本站，建议升级您的浏览器</h3><br /><br /><h3>如果您正在使用手机等客户端打开本APP，建议您升级您的操作系统</h3>").css({background: '#fff', fontSize: '.5rem', textAlign: 'center'});
		return;
	}


	var t = '?t=' + (new Date()).getTime();
	
	/**
	 * 设置参数
	 */
	var settings = {
		
		api: {
			location: "",
			version: "",
			versionSendType: 'url', //param、header
		},
		isChangeURL: false
	}


	
	var app = {
		//设置方法
		settings: function(param){

			settings = object_merge(settings, param);
		},

		api: {
			ajax: function(url, type, param, callback){
				ajax(url, param, type, callback);
			},
			get: function(url, param, callback){
				ajax(url, param, 'get', callback);
			},

			post: function(url, param, callback){
				ajax(url, param, 'post', callback);
			}
		},

		load_page: function(_this){
			load_page.call(_this);
		},

		back: function(){
			var prev_page_index = app.apphistory.length - 2;
			if(prev_page_index < 0){
				return;
			}
			
			var prev_page_data = app.apphistory[prev_page_index];
			
			load_page(null, prev_page_data);
			app.apphistory.pop();
			app.apphistory.pop();
			
		}
	}

	//对浏览器原生的a标签跳转机制进行调整
	$("html").on("click", "a[app]", load_page);

	app.apphistory = [];

	/**
	 * 发送ajax请求
	 * @param  {[type]}   url      [description]
	 * @param  {[type]}   param    [description]
	 * @param  {[type]}   method   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	function ajax(url, param, method, callback){
		for(var i in settings.api){
			if(settings.api[i] === ""){
				console.info("在此之前请调用 api.settings 方法");
				return;
			}
		}

		var ajaxObj = {
			type: method,
			data: param,
			url: settings.api.location + "/" + url,
			dataType: 'json',
			async:true,
			xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data){
            	callback && callback(data);
            }
		};

		switch(settings.api.versionSendType){
			case 'url':
				ajaxObj.url = settings.api.location + "/" + settings.api.version + "/" + url;
				break;
			case 'param':
				ajaxObj.data.version = settings.api.version;
				break;
			case 'header':
				ajaxObj.headers = {
					'Api-Version': settings.api.version, 
				}
			break;
		}

		$.ajax(ajaxObj);

		// todo 当发生异常时，提示异常
	}




	/**
	 * 加载指定页面
	 * @param  {[type]} _this     [description]
	 * @param  {[type]} page_data [description]
	 * @return {[type]}           [description]
	 */
	function load_page(_this, page_data){

		if(page_data){
			var dataHref = page_data.html;
			var dataId = page_data.container_id;
			var dataCss = page_data.css;
			var dataJs = page_data.js;
			
			var dataObj = page_data.obj;
		}else{
			var dataHref = $(this).attr("href");
			var dataId = $(this).attr("container");
			var dataCss = $(this).attr("css");
			var dataJs = $(this).attr("js");
		
			var dataObj = $(this).attr("data-obj");
			if(dataObj){
				dataObj = dataObj.replace(/'/g, '"');
				
				(dataObj = $.parseJSON(dataObj));
				w.dataObj = dataObj;
			}
			dataCss = dataCss ? dataCss.split("|") : "";
			dataJs = dataJs ? dataJs.split("|") : "";
		}
		if(settings.isChangeURL){
			w.history.pushState(null, null, dataHref);
		}
		
		var page_data = {
			html: dataHref,
			css: dataCss,
			js: dataJs,
			container_id: dataId,
			obj: dataObj
		};

		app.apphistory.push(page_data);
		
		dataHref && load.html(dataHref, dataId, function(){
			$(window).resize();
			dataCss && load.css(dataCss, function(){
				$(window).resize();
				dataJs && load.js(dataJs);
			});
		});



		return false;
	}


	
	function load(){
		
		this.html = function(url, id, callback){
			
			$.get(url + t, function(data){
				$("#" + id).html(data);
				callback && callback();
			});
		}
		
		this.css = function(arr, callback){
			
			if(arr.length > 0){
				
				var href = arr[0] + t;
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

				arr.shift();
				var tmp = this.css;
				cssReady(function(){
					tmp(arr, callback);
				});

				
				
			}else{
				callback && callback();
			}
		}
		
		this.js = function(arr, callback){

			for(i in arr){
				var src = arr[i] + t;
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


	/**
	 * 等待CSS加载并渲染完毕
	 * @param  {Function} fn   [description]
	 * @param  {[type]}   link [description]
	 * @return {[type]}        [description]
	 */
	function cssReady(fn, link) {
		var d = document,
		t = d.createStyleSheet,
		r = t ? 'rules' : 'cssRules',
		s = t ? 'styleSheet' : 'sheet',
		l = d.getElementsByTagName('link');
		// passed link or last link node
		link || (link = l[l.length - 1]);
		function check() {
			try {
				return link && link[s] && link[s][r] && link[s][r][0];
			} catch(e) {
				return false;
			}
		}

		(function poll() {
			check() && setTimeout(fn, 0) || setTimeout(poll, 100);
		})();
	} 


	/**
	 * 对象合并[递归级]
	 * @param  {[type]} obj1 [description]
	 * @param  {[type]} obj2 [description]
	 * @return {[type]}      [description]
	 */
	function object_merge(obj1, obj2){
		// for(var i in obj1){

			for(var j in obj2){
				if(obj1.hasOwnProperty(j) && (typeof(obj1[j]) == 'object')){
					if(typeof(obj2[j]) == 'object'){
						obj1[j] = object_merge(obj1[j], obj2[j]);
					}
				}else{
					obj1[j] = obj2[j];
				}
			}

			return obj1;
		// }
	}

	/**
	 * 检测浏览器是否支持html5
	 * @return {Boolean} [description]
	 */
	function is_html5(){
		var my_canvas = $("<canvas />");
		$("body").append(my_canvas);
		if(!my_canvas.get(0).getContext){

			return false;
		}
		return true;
	}

	var load = new load();
	
	

	
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




	/**
	 * 消息弹出
	 * @param  {[type]} msg         [description]
	 * @param  {[type]} m_width     [description]
	 * @param  {[type]} m_height    [description]
	 * @param  {[type]} m_loop_time [description]
	 * @param  {[type]} m_type      [description]
	 * @return {[type]}             [description]
	 */
	var alert_message = function(msg, m_width, m_height, m_loop_time, m_type){
		
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
			zIndex: '9999',
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

	app.alert = {
		error: function(msg, m_width, m_height, m_loop_time){
			alert_message(msg, m_width, m_height, m_loop_time, 'error');
		},
		success: function(msg, m_width, m_height, m_loop_time){
			alert_message(msg, m_width, m_height, m_loop_time, 'success');
		}
	}




	w.app = app;
}(window));

