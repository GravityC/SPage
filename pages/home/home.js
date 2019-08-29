// pages/home/home.js
let a, b
Page('home', {
  data: {
    eventNum:1,
    time:0,
    start:new Date().getTime(),
  },

  testNavigate(){
  },

  testEvent(){
    wx.$event.emit('test', 1, 2)
  },

  onNavigate(query){
  },
  onLoad(options) {
  },
  onShow(){
  }

})