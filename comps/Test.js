// comps/Test.js
Component({
  lifetimes:{
    created(){
      
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    a:5,
    b:6
  },
  computed:{
    c(){
      return this.data.a +　this.data.b
    }
  },

  /**
   * 组件的方法列表
   */
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
      wx.$event.emit('home')
    },
    testCurPage(){
      const page = this.$getCurPage()
      console.log(page)
      console.log(this.$getCurPageName())
    },
  }
})
