// pages/home/home.js
let a, b
Page({
  $name:'home',
  data: {
    eventNum:1,
    time:0,
    start:new Date().getTime(),
  },
  onNavigate(query){
    console.log('query')
  },
  onLoad(options) {
    this.$on('home', function(){
      console.log(123)
    })
  },
  onShow(){
    console.log('home onShow')
  },
  onUnload(){
    console.log('onUnload')
  },
  testEvent(){
    this.$emit('home')
  }
})