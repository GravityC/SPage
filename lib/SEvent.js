class SEvent {
  constructor(eventName, isGetEvent) {
    if (!isGetEvent) {
      throw 'SEventError：get SEvent instance from SEvent.getEvent！'
    }
    this.handlers = []
    SEvent.events[eventName] = this
  }

  static getEvent(eventName) {
    SEvent.events = SEvent.events || {};
    const keys = Object.keys(SEvent.events)
    for (const key of keys) {
      if (key === eventName) {
        return SEvent.events[key]
      }

    }
    return new SEvent(eventName, true)
  }

  static removeEvent(eventName) {
    const keys = Object.keys(SEvent.events)
    for (const key of keys) {
      if (key === eventName) {
        SEvent.events[key].handlers = null
        delete SEvent.events[key]
      }
    }
  }

  on(handler) {
    if (handler && typeof (handler) === 'function') {
      this.handlers.push(handler)
    }
  }

  once(handler){
    const originHandler = handler
    handler = (args) => {
      originHandler(args)
      this.off(handler)
    }
    this.on(handler)
  }

  emit(args) {
    if (!(this.handlers && this.handlers.length)) return
    let l = this.handlers.length
    let i = 0
    while(i < this.handlers.length){
      this.handlers[i++](...arguments)
      // 防止删除某些once事件的handler导致length改变
      if (this.handlers.length == l - 1) {
        i--
        l--
      }
    }
  }

  off(handler) {
    if (!(this.handlers && this.handlers.length)) return
    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlers[i] === handler) {
        this.handlers.splice(i, 1)
        break
      }
    }
  }
}


module.exports = SEvent


