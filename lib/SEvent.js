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

  emit(args) {
    if (!(this.handlers && this.handlers.length)) return
    for (const fn of this.handlers) {
      fn(args)
    }
  }

  remove(handler) {
    if (!(this.handlers && this.handlers.length)) return
    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlers[i] === handler) {
        this.handlers.splice(i, 1)
      }
    }
  }
}


module.exports = SEvent


