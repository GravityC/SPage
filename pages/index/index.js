Page('index', {
  data: {
    test:'',
    n1:1,
    n2:5,
  },
  computed:{
    test2(){
      return this.data.test + 'computed prop'
    },
    n3(){
      console.log(this)
      return this.data.n1 + this.data.n2
    }
  },
  testEvent(){
    console.log(this)
  },
  testRoute(){
    this.$route('../home/home')
  },
  clickme(){
    this.$setData({
      n1:++this.data.n1
    })
  },
  onLoad: function () {
    this.testEvent()
  },
  onShow(){
  },
  onNavigate(){
    console.log(123)
  },
  getUserInfo: function(e) {
    
  }
})
