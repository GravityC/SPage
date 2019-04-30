// pages/home/home.js
Page('home', {
  data: {
    time:0,
    start:new Date().getTime(),
  },

  onNavigate(){
    console.log('onNavigate', new Date().getTime())
  },
  onLoad(options) {
    console.log('onLoad', new Date().getTime())
  },

})