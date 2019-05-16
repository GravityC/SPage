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
    a = this
    console.log(a)
  },
  onLoad(options) {
    b = this
    console.log(b)
    console.log(a === b)
  },

})