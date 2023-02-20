// pages/wishDetail/wishDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:1,
   userdata:{},
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      // pid:options.pid,
      userInfo:wx.getStorageSync("userInfo")
    })

    console.log("pid " + this.data.userInfo)
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
        pid:that.data.pid
        // pid:1
      },
      success: function (res) {
        let result = res.data.data
        if(result.resultCode ===2000){ // 成功
          that.setData({
         userdata:result.detail
          })
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },
  edituser() {
        var that = this;
        if (that.data.userdata) {
          if (that.data.userdata.name == '' ||that.data.userdata.name == null) {
            that.opact("姓名不能为空");
            return
          }
        }
    
        // console.log("that.data.fromJb",that.data.fromJb); 
        if (!that.data.userdata) {
          console.log("that.data.formData.phone",that.data.userdata.phone);
          if (that.data.userdata.phone === '' || that.data.userdata.phone === null || that.data.userdata.phone === undefined) {
            that.opact("联系方式不能为空");
            return
          }
          if(!that.checkPhone(that.data.userdata.phone)){
            that.opact("联系方式格式不正确");
            return
          }
        }
      wx.request({
          url: app.globalData.webroot + '/xcx/api/updateuser',
          data: {
        name: that.data.userdata.name,
        phone: that.data.userdata.phone,
        nick: that.data.userdata.nick,
        type: '1',
        portrait: that.data.userdata.portrait,
        pid:1
          },
          method: 'post',
          header: {
            'content-type': 'application/json;charset=UTF-8',
          },
          success: function (res) {
            that.setData({
    //           hidden: true,
              'userdata.name': that.data.userdata.name,
              'userdata.phone': that.data.userdata.phone,
              'userdata.nick': that.data.userdata.nick,
              'userdata.type': '1',
              'userdata.portrait': that.data.userdata.portrait,
              'userdata.pid': 1,

            });
            // console.log('wxuserInfo', that.data.userdata);
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


  // toPage(e){
  //   var url = e.currentTarget.dataset.url
  //   if(this.data.userInfo.pid === this.data.detail.wishuserid){
  //     app.toast("不能实现自己发布得愿望")
  //     return 
  //   }
  //   wx.navigateTo({
  //     url: url
  //   })
    
  // },
    })
