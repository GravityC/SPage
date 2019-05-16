// pages/home/home.js
Page('home', {
  data: {
    eventNum:1,
    time:0,
    start:new Date().getTime(),
  },

  testEvent(){
    
  },

  onNavigate(query){
    console.log(1, query)
  },
  onLoad(options) {
    console.log(2, options)
  },

})