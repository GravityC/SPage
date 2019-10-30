Page({
  $name:'index',
  data: {
    test: '',
    n1: 0,
    n2: 0,
    n3: 0,
    ifShowTest:true
  },
  onNavigate() {},
  onLoad() {
    console.log('----------------------onLoad----------------------')
    console.log('page', this)
    this.id = wx.$event.on('login', (str) => {
      console.log(str)
    })
    const json = {
      '1':123
    }
    console.log(json)
  },
  onShow(){
    
  },
  computed: {
    test2() {
      return this.data.test + 'computed prop'
    },
  },
  testEvent() {
    this.$emit('test')

  },
  testEvent2(){
    this.$setData({
      ifShowTest:!this.data.ifShowTest
    })
  },
  testRoute() {
    this.$route('../home/home')
  },
  clickme() {
    this.$setData({
      n1: ++this.data.n1
    })
  },
  getUserInfo: function(e) {

  },
})