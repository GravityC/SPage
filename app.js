//app.js
require('/lib/SPage.js')

App({
  $mixinP:{
    $previewImage(e){
      const data = e.currentTarget.dataset
      if (!data.hasOwnProperty('urls') || !data.hasOwnProperty('current')) return
      const { urls, current } = data
      wx.previewImage({
        urls,
        current,
      })
    },
    $wait(){
      wx.showToast({
        title: '披星戴月开发中...',
        icon: 'none'
      })
    },
    $set(e){
      const data = e.currentTarget.dataset
      if (!data.hasOwnProperty('key') || !data.hasOwnProperty('value')) return
      const { key, value } = data
      this.$setData({
        [key]: value
      })
    },
    onLoad(){
      console.log(this.$name, 'app onLoad')
    }
  },
  $mixinC:{
    // lifetimes:{
    //   attached(){
    //     console.log('attached')
    //   }
    // }
  },
  onLaunch() {
    
  },
  globalData: {
    userInfo: null
  }
})