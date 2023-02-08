// pages/wishDetail/wishDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:"",
    detail:[],
    userInfo:{},
    name:"",
    content:"",
    adder:""
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
    this.getDetail()
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
          that.setData({
            detail:result.data.data[0],
            name:result.data.data[0].wishusername,
            content:result.data.data[0].wishContent,
            adder:result.data.data[0].adder
          })
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },
  inputname(e){
    var wishname=e.detail.value
    this.setData({
      name:wishname
    })
    console.log(this.data.name);
  },
  inputcont(e){
    var cont=e.detail.value
    this.setData({
      content:cont
    })
    console.log(this.data.content);
  },
  inputadder(e){
    var sadder=e.detail.value
    this.setData({
      adder:sadder
    })
    console.log(this.data.adder);
  },

  toPage(e){
    var that =this
    wx.request({
      url: app.globalData.Jweb + '/wish/mywish/editwishbyid',
      method: 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        name:that.data.name,
        content:that.data.content,
        adder:that.data.adder,
        pid:that.data.pid
      },
      success: function (res) {
 
        if(res.data ===1){ // 成功
          wx.showToast({
            title: '成功',
            duration: 1000,
            success: function () {
            setTimeout(function () {
            wx.reLaunch({
            url: '/pages/my/mywish/mywish'
              })
            }, 1000);
           }
         })    
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
    
  },

})