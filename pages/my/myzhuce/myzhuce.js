// pages/wishDetail/wishDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:1,
    userdata:{},
    nick:"",
    name:"",
    phone:""
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
      url: app.globalData.webroot + 'xcx/api/getUserById', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        pid:that.data.userdata.pid
        // pid:1
      },
      success: function (res) {
        let result = res.data.data
        result.detail.portrait=app.globalData.webroot +result.detail.portrait
        if(result.resultCode ===2000){ // 成功
          that.setData({
         userdata:result.detail,
         nick:result.detail.nick,
         name:result.detail.name,
         phone:result.detail.phone
          })
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },
   /**
   * 提示文字
   */
  opact: function (txt) {
    wx.showToast({
      title: txt,
      mask: false,
      icon: "none",
      duration: 2000
    });
  },
  edituser() {
      var that = this;
      if (that.data.name == '' || that.data.name == null) {
        that.opact("姓名不能为空");
        return
      }
      if (that.data.phone === '' || that.data.phone === null || that.data.phone === undefined) {
        that.opact("联系方式不能为空");
        return
      }
      if(that.data.nick=== '' || that.data.nick=== null || that.data.nick=== undefined){
        that.opact("微信昵称不能为空");
        return
      }
      wx.request({
        url: app.globalData.webroot + '/xcx/api/updateuser',
        data: {
        name: that.data.name,
        phone: that.data.phone,
        nick: that.data.nick,
        type: '1',
        portrait: that.data.userdata.portrait,
        pid:that.data.userdata.pid
        },
        method: 'post',
        header: {
          'content-type': 'application/json;charset=UTF-8',
        },
        success: function (res) {
            that.setData({
    //           hidden: true,
              'userdata.name': that.data.name,
              'userdata.phone': that.data.phone,
              'userdata.nick': that.data.nick,
              'userdata.type': '1',
              'userdata.portrait': that.data.userdata.portrait,
              'userdata.pid': that.data.userdata.pid,

            });
            wx.setStorageSync('wxuserInfo', that.data.userdata)
            if (that.data.userdata) {
              wx.navigateBack()
            } else {
              wx.switchTab({
                url: '/pages/my/my/my'
              })
            }
          },
          fail: function () {
            that.opact("操作失败，请稍后再试");}})}

    })
