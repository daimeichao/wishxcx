// pages/wishDetail/wishDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:"",
    detail:{},
    userInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wxuserInfo = wx.getStorageSync('userInfo') 
    this.setData({ 
      pid:options.pid,
      userdata: wxuserInfo,
      openid:wxuserInfo.openid
    })
    this.getSelectData();
  }
  ,

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
  getSelectData: function () {
    var that =this;
    wx.request({
      url: app.globalData.Jweb+'wish/my/info',
      data: {
        openid:that.data.openid
      },
      method: 'get',
      header: {
        'content-type': 'application/json;charset=UTF-8',
      },
      success: function (res) {
        that.setData({
          userdata:res.data.data.data[0],
          //pid:res.data.data.data[0].pid
        })
      },
      fail: function (e) {
        that.opact("操作失败，请稍后再试");
      }
    });
  },

  getDetail(){
    var that =this 
    // use api
    wx.request({
      url: app.globalData.Jweb + '/wish/mywish/getwishbyid', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        pid:that.data.pid
      },
      success: function (res) {
        let result = res.data
        if(result.status ==="success"){ // 成功
          var dds=result.data.data[0];
          dds.wishTime= dds.wishTime.substr(0,10);
          that.setData({
            detail:dds
          })
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },



  toPage(e){
    var url = e.currentTarget.dataset.url
    // if(this.data.userInfo.pid === this.data.detail.wishuserid){
    //   app.toast("不能实现自己发布得愿望")
    //   return 
    // }
    wx.navigateTo({
      url: url
    })
    
  },

})