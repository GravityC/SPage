Page('index', {
  data: {
    test:'',
    n1:0,
    n2:0,
    n3:0,
  },
  onNavigate() {
  },
  onLoad() {
    wx.$event.once('login', () => {
      this.$setData({
        n1:1
      })
    })
    wx.$event.once('login', () => {
      this.$setData({
        n2: 1
      })
    })
    wx.$event.once('login', () => {
      this.$setData({
        n3: 1
      })
    })
  },
  computed:{
    test2(){
      return this.data.test + 'computed prop'
    },
  },
  testEvent(){
    wx.$event.emit('login')
  },
  testRoute(){
    this.$route('../home/home')
  },
  clickme(){
    this.$setData({
      n1:++this.data.n1
    })
  },
  getUserInfo: function(e) {
    
  },
  test(a, b){
  }
})
