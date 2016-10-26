# application.js

#依赖

`jquery`

#使用方法

引入 `<script src="application.js"></script>`

##使用api接口

设置api服务器地址

`window.api.host = "http://xxx.xxx.xxx/";`

设置api版本

`window.api.version = 'v1';`

api请求分为两种

发送get请求

```
window.api.get('接口名称', 回调函数);
```
如

```
window.api.get('user/get_name', function(data){
    //todo 接口请求成功后的后续操作
});
```

如上代码将发送如下请求

```
Request URL:http://xxx.xxx.xxx/v1/user/get_name
Request Method:GET
Host:xxx.xxx.xxx
```

发送post请求

`window.api.post(接口名称, 参数, 回调函数);`

如

```
window.api.post('user/set_name', {name: 'testname'}, function(){
    //todo 接口请求成功后的后续操作
});
```

如上代码将发送如下请求

```
Request URL:http://xxx.xxx.xxx/v1/user/get_name
Request Method:POST
Host:xxx.xxx.xxx
Form Data:
name:testname
```


##使用自动载入

自动载入包括html、css、js。自动载入默认使用的还是`<a>`标签，但对`<a>`标签的机制进行了调整，点击`<a>`标签不再是同步页面跳转，而是自动进行异步页面加载

对`<a>`标签进行了属性扩展，现增加属性如下

`data-href` 需要异步加载的html文件地址

`data-id`    容器id，将会把异步加载的内容渲染到指定的容器中

`data-css` 需要异步加载的css文件地址

`data-js` 需要异步加载的js文件地址

`data-obj` 需要夸页面传输的数据

使用示例
```
<a 
	href="javascript:void(0)"
	data-id="content"
	data-href="register.html"
	data-css="register.css"
	data-js="register.js"
	data-obj="{user_id: 111}"

>这是一个超连接</a>
```
多css自动载入
`data-css="css1.css|css2.css|css3.css"`

多js自动载入
`data-js="js1.js|js2.js|js3.js"`


###构造函数

对于异步引入的js文件，会自动运行起内部的构造函数

*建议每个js文件都要闭包，以免各个js文件中产生命名冲入

如

```
(function(w){
    //todo 这里开始编辑js代码
	var file_name = 'brand.js'; //当前js文件的文件名
	// 构造函数
	w[file_name] = function(){
		//todo 需要初始化的逻辑
	}
	w[file_name]();
	
	
	// todo 其它的代码逻辑
}(window));
```


