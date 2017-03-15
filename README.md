# application.js

#依赖

`jquery 3.1.1`

#使用方法

引入 `<script src="application.js"></script>`

##使用之前的设置

```
app.settings({
	api: {
		location: "http://xxx.xxx.xxx/", //设置api服务器地址
		version: 'v1', //设置api版本
		versionSendType: 'url', //版本号的发送方式，可能的值 url、headers、param，默认为 url
	},
	isChangeURL: false //是否开启url自动变更，此选项仅在  server中允许时可以被设置为true
});
```

##使用api接口

api请求分为两种

发送get请求

```
app.api.get('接口名称', 回调函数);
```
如

```
app.api.get('user/get_name', {name: 'testname'}, function(data){
    //todo 接口请求成功后的后续操作
});
```

如上代码将发送如下请求

```
Request URL:http://xxx.xxx.xxx/v1/user/get_name?name=testname
Request Method:GET
Host:xxx.xxx.xxx
```

发送post请求

`app.api.post(接口名称, 参数, 回调函数);`

如

```
app.api.post('user/set_name', {name: 'testname'}, function(){
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

	如果 `versionSendType` 设置为 `param`
则

get时候  `Request URL:http://xxx.xxx.xxx/user/get_name?version=v1`

post时候 

```
Form Data:
version:v1
```

	如果 `versionSendType` 设置为 `header`
则会在发送请求时在`Request Headers`中增加一个 `Api-Version`的参数
此种情况，需要服务器在 `Response Headers`中的 `Access-Control-Allow-Headers`参数中增加`Api-Version`或者直接设置为`*`

##使用异步载入

自动载入包括html、css、js。自动载入默认使用的还是`<a>`标签，但对`<a>`标签的机制进行了调整，点击`<a>`标签不再是同步页面跳转，而是自动进行异步页面加载

成功载入html或全部css后会自动触发window的resize事件

对`<a>`标签进行了属性扩展，现增加属性如下

`app` 此处必需填写，但无需填写值。无此属性的`a`标签依然采用同步跳转机制

`href` 需要异步加载的html文件地址

`container`    容器id，将会把异步加载的内容渲染到指定的容器中

`css` 需要异步加载的css文件地址

`js` 需要异步加载的js文件地址

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
`css="css1.css|css2.css|css3.css"`

多js自动载入
`js="js1.js|js2.js|js3.js"`

###命名空间

为了避免命名冲突的问题，本js提供了注册命名空间的方法

//假设当前js所在的位置为 `js/a/test.js` 

`app.namespace.register('js.a.test');` 即可

之后则可以直接使用 `js.a.test`

例如

```
js.a.test.alert = function(msg){
	
	alert("^_^" + msg + "^_^");
}

js.a.test.isShow = true;
……
```



###构造函数

对于异步引入的js文件，会自动运行内部的构造函数

*为了免各个js文件中产生命名冲突，建议每个js文件都要闭包 或 各个变量、函数均使用命名空间

如

```
//假设当前js文件的文件名是 'js/a/brand.js'
app.namespace.register('js/a/brand'); //注册命名空间
(function(w){

	// 构造函数
	js.a.brand = function(){
		//todo 需要初始化的逻辑
	}
	
	
	// todo 其它的代码逻辑
}(window));
```

###返回上一页

直接调用 `app.back();`即可


