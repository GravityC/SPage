# SPage

### 使用
将SPage.js、SEvent.js、SRequest.js放置到项目的同一目录下，然后在app.js文件中引入
```javascript
//app.js
require('/lib/SPage.js')
```
## 全局对象
+ **wx.$event**
用于页面间通信的事件分发机制，方法如下：
	+ `on(eventName, handler)` 订阅事件
	+ `once(eventName, handler)` 订阅事件，只会触发一次
	+ `emit(eventName)` 分发事件
	+ `off(eventName, handler)` 卸载事件监听
	+ `remove(eventName)` 卸载事件的所有handler

+ **wx.$http**

	wx.request的封装与扩展，提供了拦截器的配置。
	+ **对象**：
		+ **wx.$http.config**，每次请求时的默认配置，可以配置wx.request除三个回调函数外的[参数](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)，以及`baseUrl`以下是默认配置	
		```javascript
		config = {
			baseUrl:'',
			dataType: 'json',
			responseType: 'text',
			header: {},
  		}
		```

	+ **方法**：
		+ **wx.$http.request**(config)
		`config`：本次请求参数，可覆盖默认配置，下同
		+ **wx.$http.get**(url, config) 
		method为'GET'的request方法。
		`url`：请求地址，下同
		+ **wx.$http.post**(url, data, config)
		`data`:config中的data参数，下同
		+ **wx.$http.put**(url, data, config)
		+ **wx.$http.delete**(url, config)
		
	以上方法均有别名。分别为`wx.$request`,`wx.$get`,`wx.$post`,`wx.$put`,`wx.$delete`
	+ **拦截器**：
		+ wx.$http.interceptors.request.use(success<`Function`>, fail<`Function`>)
		配置请求拦截器
		+ wx.$http.interceptors.request.use(success<`Function`>, fail<`Function`>)
		配置响应拦截器
		
	+ **用法示例**：
	```javascript
	require('/lib/SPage.js')
	APP({
		onLaunch(){
			wx.$http.config.baseUrl = 'https://x.xx.xxx/xxxx/'
			wx.$http.interceptors.request.use(config => {
				console.log('请求拦截', config)
				return config
			})
			wx.$http.interceptors.response.use(res => {
				console.log('响应拦截', res)
				return res
			}, res => {
				console.log('请求出错', res)
				return res
			})
		}
	})
	```

## 全局方法
+ **wx.$getCurPage()**
返回当前页面实例

+ **wx.$getCurPageName()**
返回当前页面名

+ **wx.$place(key, value)**
指定`key`保存一份数据，可以为任何类型，以供其它逻辑获取使用

+ **wx.$take(key)**
根据`key`获取数据，数据只能被存在一次，获取一次。如果只存放一次，第二次获取 会得到 null 。

+ **wx.$route(url<`String`>, query<`Object`>)**
wx.navigateTo的封装
	+ `url` - 跳转路径
	+ `query` - 携带参数

## 扩展App
**$mixinP对象。此对象中的所有属性会合并到每个Page对象中，合并策略：**
* 1.若属性名为Page自带的[钩子函数](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)，即以“on”开头的方法，则这些方法在各个Page实例定义的对应钩子函数之前执行：
```javascript
require('/lib/SPage.js')
App({
	$mixinP:{
		onLoad(options){
			console.log(this.$name, options)
		}
	}
})
```
如以上定义$mixin.onLoad方法后，该方法会在所有页面执行onLoad方法之前执行
* 2.若属性名为“data”,则该键对应值必须为一个对象，其中的所有属性合并到各个Page实例的data属性中（当两个data对象中有同名属性时，Page中的属性覆盖App中的）
* 3.属性名为其他时，Page实例中的同名属性覆盖该属性。

**$mixinC对象。此对象中的所有属性会合并到每个Page对象中，合并策略：**
* 1.若属性名为lifetimes或pageLifetimes，则其下的生命周期函数会按mixinP策略一合并到各个Component实例中。
* 2.若属性名为'properties', 'data', 'observers', 'methods', 'options'其中之一，则按照mixinP策略二合并。
* 3.同mixinP策略三。

## 扩展Page
####生命周期
+ **onNavigate**
在`onLoad`之前执行，可用于页面跳转延时时的请求数据操作。**注意：**
	+ 1.该页面必须声明$name属性
	+ 2.必须使用$route跳转到该页面

#### 属性
+ **$name** < `String` >
必须指定$name属性才能调用`onNavigate`
+ **$status** <`Object`>
页面的一些状态集合，有以下字段：
	+ isFirstShow <`Boolean`> 是否首次展示该页面
+ **computed** <`Object`>
	扩展了computed计算属性，与Vue的用法相同
	**注意：必须使用$setData才能触发**

#### 方法
+ **$setData**(obj<`Object`>)
`setData`的封装，必须使用`$setData`才能触发`computed`计算属性

+ **$route**(url, query)
同`wx.$route`

+ **$place**(key, value)
同`wx.$place`

+ **$take**(key)
同`wx.$route`

+ **$request**(config)
同`wx.$request`

+ **$get**(url, config)
同`wx.$get`

+ **$post**(url, data, config)
同`wx.$post`

+ **$put**(url, data, config)
同`wx.$put`

+ **$delete**(url, config)
同`wx.$delete`

## 扩展Component
#### 方法
+ **$setData**(obj<`Object`>)
`setData`的封装，必须使用`$setData`才能触发`computed`计算属性

+ **$getCurPage**()
同`wx.$getCurPage`

+ **$getCurPageName**()
同`wx.$getCurPageName`

+ **$route**(url, query)
同`wx.$route`

+ **$place**(key, value)
同`wx.$place`

+ **$take**(key)
同`wx.$route`

+ **$request**(config)
同`wx.$request`

+ **$get**(url, config)
同`wx.$get`

+ **$post**(url, data, config)
同`wx.$post`

+ **$put**(url, data, config)
同`wx.$put`

## 写给自己
当初半路接手公司项目，想要用框架重构，但被项目经理拒绝了。。。只好自己边写业务代码边写一个自己的小框架，因此框架的功能全是平时小程序工作中常用的，有一些异想天开的功能也被自己毙掉了，毕竟原设想就是简洁为主嘛。
完善框架的过程中，有一些功能，通过各博客或实现了、或受到了启发，让自己受益良多，也对小程序的机制有了深入的了解。特别感谢腾讯WeTest的[微信小程序之提高应用速度小技巧](https://wetest.qq.com/lab/view/294.html?from=content_csdnblog)。
记得某次面试谈及我的一个webpack脚手架，面试官问现在市面上的脚手架这么多，为什么要用你自己的呢。我愣住了，不知道如何回答，是啊，为什么呢，我的脚手架根本没有优势。但现在我会回答，因为这是我自己写的。
