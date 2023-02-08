// pages/newBannerDetail/newBannerDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:'',
    contentN:'',
    url:'',
    type:'',
    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({ 
      url:options.url,
      type:options.type,
      pid:options.pid
    })
  

    console.log("pid "+this.data.pid )
    this.getBannerDetail(this.data.pid)
  
    // that.setData({ 
    //   content: content
    // })

    console.log("url= " + this.data.url)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  getBannerDetail:function(id){
    let that = this
    // use api
    wx.request({
      url: app.globalData.webroot + 'xcx/api/getBannerDetail', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        id:id
      },
      success: function (res) {
        let result = res.data.data
        if(result.resultCode ===2000){ // 成功
          
          that.setData({ 
            content: result.bannerDetail.content
          })
        
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  }
})