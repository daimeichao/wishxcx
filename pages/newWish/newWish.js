// pages/newWish/newWish.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userName:'',
    content:'',
    adder:'',
    money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      userInfo:wx.getStorageSync("userInfo")
    })
    console.log(this.data.userInfo)
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
    //自定义方法
    getParam: function (e) {
      this.setData(app.updParam(e))
    },



    addWish(){
      var that =this 
      if(that.data.userName === null ||that.data.userName ==='' ){
        app.toast('请输入姓名')
        return 
      }

      
      // if(that.data.money === null ||that.data.money ==='' ){
      //   app.toast('请输入您的许愿地点')
      //   return 
      // }

      if(that.data.adder === null ||that.data.adder ==='' ){
        app.toast('请输入您的许愿金额')
        return 
      }



  
      if(that.data.content === null ||that.data.content ==='' ){
        app.toast('请输入您的心愿')
        return 
      }

  
      // use api
      wx.request({
        url: app.globalData.webroot + 'xcx/api/addWish', //上线的话必须是https，没有appId的本地请求貌似不受影响 
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
        header: {
          "Content-Type": "application/json",
        }, // 设置请求的 header
        data: {
          wishusername:that.data.userName,
          wishuserid:that.data.userInfo.pid,
          wish_content:that.data.content,
          adder:that.data.adder,
          wish_audit_remark:'',
          operatorid:'',
          money:that.data.money
        },
        success: function (res) {
          let result = res.data.data
          if(result.resultCode ===2000){ // 成功
            app.toast("发布成功，等待管理员审核")

            setTimeout(function () {
              wx.redirectTo({
                url:'/pages/index/index'
              })
            }, 1000)
          
          }else{ // 失败
            app.toast(result.message)
          }
        },
      })
    },
    toPageR(e){
      console.log(111111111111111)
      var url = e.currentTarget.dataset.url
      wx.redirectTo({
        url: url,
      }) 
    },
  
  
})