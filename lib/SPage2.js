const SPage = function(option){
  const computed = option.computed || {}
  const computedKeys = Object.keys(computed)
  const computedCache = {}

  option.$setData = function(obj){
    extendComputed(obj)
    return this.setData(obj)
  }

  const extendComputed = function(obj){
    if (!(option.computed && typeof (option.computed) == 'object')) 
      return 
    Object.assign(option.data, obj)
    const needUpdate = calcComputed()
    Object.assign(obj, needUpdate)
  }

  const calcComputed = function(isInit) {
    const needUpdate = {}
    for (const key of computedKeys) {
      if (computed[key] instanceof Function) {
        const value = computed[key].call(option)
        if(value !== computedCache[key]) needUpdate[key] = computedCache[key] = value
        if(isInit) option.data[key] = needUpdate[key] // 初始化操作
      }
    }

    return needUpdate
  }

  calcComputed(true);
  Page(option)
  return option
}

module.exports = SPage