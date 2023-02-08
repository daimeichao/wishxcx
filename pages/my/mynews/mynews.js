// pages/my/mynews/mynews.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   zxdt:[],
   msgList:[],
   pagesize:999,
   curpage:1,
   count:0,
   pagecount:0,
   loading: false,
   finished: false,
   index:0,
   loading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.setData({
      msgList:[],
      curpage:1
    })
    this.getMsgList();
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

  },
  toMsgxq(item) {
    wx.navigateTo({
      url: '/pages/my/mynewxq/mynewxq?pid='+item.currentTarget.dataset.word.pid
    })
  },

  getMsgList(){
    var wxuserInfo = wx.getStorageSync('wxuserInfo') 
    var that = this;
    wx.request({
      url: app.globalData.webroot + '/xcx/msg/getXmsgList',
      data: {
        e: new Date(),
        jsrid :wxuserInfo.pid,
        curpage:that.data.curpage,
        pagesize:that.data.pagesize
      },
      method: "POST",
      success: function (result) {
        let res = result.data
        if (res.errorCode === 0) {
          var json = res.data
          var newList =  [...that.data.msgList, ...json.list]
          that.setData({
            msgList : newList,
            count: json.count,
            pagecount:json.pagecount
          });
          if (that.data.curpage >= that.data.pagecount) {
            that.setData({
              finished: true
            })
          }
        }
      },
      fail: function () {
        that.closeloading()
        that.opact("操作失败，请稍后再试");
      }
    })
  },
})