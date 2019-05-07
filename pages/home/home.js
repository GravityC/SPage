// pages/home/home.js
Page('home', {
  data: {
    eventNum:1,
    time:0,
    start:new Date().getTime(),
  },

  testEvent(){
    this.$event.emit('change')
  },

  onNavigate(query){
    
  },
  onLoad(options) {
    
  },

})