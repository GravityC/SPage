// comps/Test.js
Component({
  // lifetimes:{
  //   created(){
  //     this.$on('test', function(){
  //       console.log('test')
  //     })
  //   },
  //   attached(){
  //     console.log('2')
  //   },
  //   detached(){
  //     console.log('Test detached')
  //   }
  // },
  properties: {

  },
  data: {
    a:5,
    b:6
  },
  computed:{
    c(){
      return this.data.a +　this.data.b
    }
  },
  methods: {
    testComputed(){
      this.$setData({
        b:++this.data.b,
      })
    },
    testRoute(){
      this.$route('/pages/home/home')
    },
    testEvent(){
      this.$emit('test')
    },
    testCurPage(){
      const page = this.$getCurPage()
      console.log(page)
      console.log(this.$getCurPageName())
    },
  }
})
