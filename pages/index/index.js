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
    console.log('----------------------onLoad----------------')
    wx.$request.config.baseUrl = 'https://develop.geeme.cn/service-api'

    wx.$request.interceptors.request.use(config => {
      config.data.id = 210
      console.log('请求拦截', config)
    })

    wx.$request.interceptors.response.use(response => {
      console.log('响应拦截', response)
    })

    wx.$post('/customer/getServiceInfo', { appId:'wxa211e53038087920', id:162}).then( res => {
      console.log(res)
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
