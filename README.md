# application.js

#依赖

`jquery 3.1.1`

#使用方法

引入 `<script src="application.js"></script>`

##使用之前的设置

```
api.settings({
	location: "http://xxx.xxx.xxx/", //设置api服务器地址
	version: 'v1', //设置api版本
	isChangeURL: false //是否开启url自动变更，此选项仅在  server中允许时可以被设置为true
});
```

##使用api接口

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


##使用异步载入

自动载入包括html、css、js。自动载入默认使用的还是`<a>`标签，但对`<a>`标签的机制进行了调整，点击`<a>`标签不再是同步页面跳转，而是自动进行异步页面加载

成功载入html或全部css后会自动触发window的resize事件

对`<a>`标签进行了属性扩展，现增加属性如下

`app` 此处必需填写，但无需填写值。无此属性的`a`标签依然采用同步跳转机制

`data-href` 需要异步加载的html文件地址

`data-id`    容器id，将会把异步加载的内容渲染到指定的容器中

`data-css` 需要异步加载的css文件地址

`data-js` 需要异步加载的js文件地址

`data-obj` 需要夸页面传输的数据

使用示例
```
<a 
	app
	container="content"
	href="register.html"
	css="register.css"
	js="register.js"
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

###返回上一页

直接调用 `window.back();`即可


