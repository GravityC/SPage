// pages/home/home.js
let a, b
Page({
  $name:'home',
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
    console.log('query')
  },
  onLoad(options) {
    console.log('home onLoad: ', options)
  },
  onShow(){
    console.log('home onShow')
  }

})