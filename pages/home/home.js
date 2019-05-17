// pages/home/home.js
let a, b
Page('home', {
  data: {
    eventNum:1,
    time:0,
    start:new Date().getTime(),
  },

  testNavigate(){
    console.log('test')
  },

  testEvent(){
    
  },

  onNavigate(query){
    console.log(1)
  },
  onLoad(options) {
    console.log(2)
  },
  onShow(){
    console.log(this.$status.isFirstShow)
  }

})