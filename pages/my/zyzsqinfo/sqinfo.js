// pages/wishDetail/wishDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:1,
    detail:{},
    userdata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      // pid:options.pid,
      userdata:wx.getStorageSync("userInfo")
    })

    console.log("pid " + this.data.userdata)
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
    this.getDetail()
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


  getDetail(){
    var that =this 
    // use api
    wx.request({
      url: app.globalData.webroot + '/xcx/my/getmyzyz', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        pid:that.data.userdata.pid
      },
      success: function (res) {
        let result = res.data.data
        result.detail.tx=app.globalData.webroot +result.detail.tx
        console.log("result",result)
        if(result.resultCode ===2000){ // 成功
          if(result.detail.zyz_audit_state==='0'){
            result.detail.zyz_audit_state='待审核'
          }
          else if(result.detail.zyz_audit_state==='1'){
            result.detail.zyz_audit_state='审核通过'
          }
          else{
            if(result.detail.zyz_audit_state==='2'){
              result.detail.zyz_audit_state='审核不通过'
            }
            else{
              result.detail.zyz_audit_state='暂无'
            }
          }
          that.setData({
            detail:result.detail
          })
         
        
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },



  toPage(e){
    var url = e.currentTarget.dataset.url
    if(this.data.userInfo.pid === this.data.detail.wishuserid){
      app.toast("不能实现自己发布得愿望")
      return 
    }
    wx.navigateTo({
      url: url
    })
    
  },

})