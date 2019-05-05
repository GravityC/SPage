let channel = {}

// -----------------------------以下是工具函数----------------------

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
  return wx.pages[name]
}

// -----------------------------以上是工具函数----------------------

/**
 * 封装wx.navigateTo
 * @url {string} - 跳转路径
 * @query {object} - 携带参数
 */
const $route = function(url, query) {
  const page = getPage(url)
  if (page && page.onNavigate){
    const _query = query || {}
    _query.from = this.$name
    page.onNavigate(_query)
  } 
  if (query) url = url + '?' + parseQuery(query)
  wx.navigateTo({
    url
  })
}

/**
 * 扩展computed计算属性
 */
const extendComputed = function(option) {
  // 为$setData方法响应computed
  option.$setData = function(obj) {
    addComputedToData(obj)
    return this.setData(obj)
  }

  const computed = option.computed || {}
  const computedKeys = Object.keys(computed)
  const computedCache = {}
  // 将computed的属性添加到data中
  const addComputedToData = function(obj) {
    if (!(option.computed && typeof(option.computed) == 'object'))
      return
    Object.assign(option.data, obj)
    const needUpdate = calcComputed()
    Object.assign(obj, needUpdate)
  }

  // 计算需更改的计算属性
  const calcComputed = function(isInit) {
    const needUpdate = {}
    for (const key of computedKeys) {
      if (computed[key] instanceof Function) {
        const value = computed[key].call(option)
        if (value !== computedCache[key]) needUpdate[key] = computedCache[key] = value
        if (isInit) option.data[key] = needUpdate[key] // 初始化操作
      }
    }
    return needUpdate
  }

  calcComputed(true);
}

/**
 * --------------------------------------------扩展Page
 */
const extendPage = function() {
  const originPage = Page
  Page = function(name, option) {
    // 附加$name属性，兼容旧Page
    if (typeof(name) == 'string') {
      option.$name = name
      wx.pages = wx.pages || {}
      wx.pages[name] = option
    } else {
      option = name
    }

    // 扩展computed属性
    extendComputed(option)
    // 扩展$route与onNavigate
    option.$route = $route
    // $put
    option.$put = function(id, value){
      channel[id] = value
    }
    // $take 调用完即删除引用
    option.$take = function(id){
      const v = channel[id]
      channel[id] = null
      return v
    }

    // 重新定义$setData，便于扩展其他功能
    const originData = option.$setData
    option.$setData = function (obj) {
      return originData.call(this, obj)
    }

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
    extendComputed(option)
    
    option.methods = option.methods || {}
    // 扩展$route与onNavigate
    option.methods.$route = $route
    // 重新定义$setData，便于扩展其他功能
    const originData = option.$setData
    option.methods.$setData = function (obj) {
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