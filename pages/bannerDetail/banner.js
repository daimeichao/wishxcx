// pages/bannerDetail/banner.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webroot: app.globalData.webroot, // 获取路径
    content: "",
    bannerInfo: {},
    pid: "",
    url:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      url: options.url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.getBannerById()
  },

  getBannerById() {
    var that = this
    wx.request({
      url: app.globalData.webroot + '/banner/get',
      data: {
        e: new Date(),
        pid: that.data.pid
      },
      method: "GET",
      success: function (result) {
        let res = result.data
        // console.log(res);
        if (res.errorCode === 0) {
          var json = res.data
          that.setData({
            bannerInfo: json.data ? json.data : {},
            content: json.data.vt ? json.data.vt : {}
          })

        }
      },
      fail: function () {
        that.closeloading()
        that.opact("操作失败，请稍后再试");
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})