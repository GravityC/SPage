const SEvent = require('SEvent.js')

wx.$pages = {}
wx.$event = {
  on(eventName, handler) {
    SEvent.getEvent(eventName).on(handler)
  },
  emit(eventName, args) {
    SEvent.getEvent(eventName).emit(args)
  },
  remove(eventName, handler) {
    SEvent.getEvent(eventName).remove(handler)
  },
  removeEvent(eventName) {
    SEvent.removeEvent(eventName)
  }
}
wx.$set = function(key, data, callback) {
  wx.setStorageSync(key, data)
  callback && callback()
}
wx.$get = function(key) {
  return wx.getStorageSync(key)
}
// 获取当前页面实例
wx.$getCurPage = function () {
  return getCurrentPages()[getCurrentPages().length - 1]
}

// 获取当前页面实例对应的页面名
wx.$getCurPageName = function () {
  return wx.$getCurPage().$name
}
let channel = {}

// -----------------------------以下是工具函数----------------------

// 装饰器 afterOrigin:Boolean true:装饰函数在原函数之后触发
const decorator = function(originFn, decorateFn, afterOrigin) {
  const origin = originFn
  originFn = function(args) {
    if (afterOrigin) {
      if (origin) origin.call(this, args)
      decorateFn.call(this, args)
    } else {
      decorateFn.call(this, args)
      if (origin) origin.call(this, args)
    }
  }
  return originFn
}

// 解析query对象成string
const parseQuery = function(query) {
  let str = ''
  for (const key in query) {
    str += `${key}=${query[key]}&`
  }
  return str.slice(0, -1)
}

// 从url中得到pageName
const getPageName = function(url) {
  url = url.includes('?') ? url.split('?')[0] : url
  const arr = url.split('/')
  return arr[arr.length - 1]
}

/**
 * @str - pageName或者url
 */
const getPage = function(str) {
  const name = str.includes('/') ? getPageName(str) : str
  return wx.$pages[name]
}

// 判断是否是空对象
const isEmpty = function(obj) {
  return !Object.keys(obj).length
}

// -----------------------------以下是Page、Component共用扩展模块----------------------

/**
 * 扩展computed计算属性
 */
const extendComputed = function(option) {
  let page
  // 为$setData方法响应computed
  option.$setData = function(obj) {
    this.setData(obj)
    page = this // 绑定page实例
    const needUpdate = calcComputed() // 将需要改变的computed属性添加到接下来要setData的对象中
    if (!isEmpty(needUpdate)) {
      this.setData(needUpdate)
    }
  }

  const computed = option.computed || {}
  const computedKeys = Object.keys(computed)
  let computedCache = {}

  // 计算需更改的计算属性
  const calcComputed = function(isInit) {
    const needUpdate = {}
    const that = isInit ? option : page
    for (const key of computedKeys) {
      const value = computed[key].call(that)
      if (value !== computedCache[key]) needUpdate[key] = computedCache[key] = value
      if (isInit) option.data[key] = needUpdate[key] // 初始化操作
    }
    return needUpdate
  }

  // 页面unload时清空computedCache
  option.onUnload = decorator(option.onUnload, function() {
    computedCache = {}
  })

  calcComputed(true);
}

/**
 * 为所有Page和Component扩展方法
 */
const extendFunctions = function(option){
  /**
   * 封装wx.navigateTo
   * @url {string} - 跳转路径
   * @query {object} - 携带参数
   */
  option.$route = function (url, query) {
    const page = getPage(url)
    query = query || {}
    query.from = this.$name || this.$getCurPageName() // Page || Component
    // 若page不在未加载分包中则可调用onNavigate方法
    if (page && page.onNavigate) {
      page.onNavigate(query)
    }
    url = url + '?' + parseQuery(query)
    wx.navigateTo({
      url
    })
  }

  // 用于html元素bindtap快捷设置页面data数据
  option.$set = function(e){
    const data = e.currentTarget.dataset
    if(!data.hasOwnProperty('key') || !data.hasOwnProperty('value')) return
    const key = data.key
    const value = data.value
    this.$setData({
      [key]:value
    })
  }
}

/**
 * --------------------------------------------扩展Page
 */
const extendPage = function() {
  const originPage = Page
  Page = function(name, option) {
    // 添加$name属性，兼容旧Page
    if (typeof(name) == 'string') {
      option.$name = name
      wx.$pages[name] = option
    } else {
      option = name
      option.$name = 'unKnow' //此处强行给$name赋值，为了后续区分是Page还是Component
    }
    // 添加$status属性
    option.$status = {
      isFirstShow: true
    }
    // 是否已执行过onNavigate函数
    option.$$isNavigated = false

    // 扩展computed属性
    extendComputed(option)
    // 扩展方法
    extendFunctions(option)

    // $put与$take,$take调用完即删除引用
    option.$put = function(id, value) {
      channel[id] = value
    }
    option.$take = function(id) {
      const v = channel[id]
      channel[id] = null
      return v
    }

    // 装饰onNavigate
    option.onNavigate = decorator(option.onNavigate, function(query) {
      option.$$isNavigated = true
    })

    // 装饰onLoad
    option.onLoad = decorator(option.onLoad, function(query) {
      // 若页面有onNavigate方法但还没运行，则运行onNavigate方法
      if (option.onNavigate && !option.$$isNavigated) {
        option.onNavigate(query)
      }
    })

    // 装饰onShow
    option.onShow = decorator(option.onShow, function() {
      this.$status.isFirstShow = false
    }, true)

    //原生Page构造
    originPage(option)
  }
}

/**
 * --------------------------------------------扩展Component
 */
const extendComponent = function() {
  const originComponent = Component
  Component = function(option) {
    // 扩展computed属性
    extendComputed(option)
    option.methods = option.methods || {}
    // 扩展方法
    extendFunctions(option.methods)

    // 获取当前页面实例
    option.methods.$getCurPage = wx.$getCurPage

    // 获取当前页面实例对应的页面名
    option.methods.$getCurPageName = wx.$getCurPageName

    // 重新定义$setData，便于扩展其他功能
    const originData = option.$setData
    option.methods.$setData = function(obj) {
      return originData.call(this, obj)
    }
    //原生Component构造
    originComponent(option)
  }
}

module.exports = (function() {
  extendPage()
  extendComponent()
}())

/**
 * 注意！
 * 1.onNavigate中的this与onLoad中的this不一样
 * 2.只有用$setData才能触发computed
 */

/**
 * 小程序原理：
 * 1.加载app时每次调用Page(option)方法，会将传入的option对象保存，加载页面时深拷贝option对象
 */