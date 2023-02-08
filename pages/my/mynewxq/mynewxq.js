// pages/my/mynewxq/mynewxq.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgxq:[],
    pid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      pid:options.pid
    });
    this.getXmsgByid();
    
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
  toback(){
    wx.navigateBack()
  },
  toXmDetail() {
    let pid = this.data.msgxq.xmid
    wx.navigateTo({
      url: '/pages/proinfo/proinfo?pid=' + pid + '&iffromMy=true',
    })
  },
  getXmsgByid(){
    var that = this;
    wx.request({
      url: app.globalData.webroot + '/xcx/msg/getXmsgByid',
      data: {
        e: new Date(),
        pid:that.data.pid
      },
      method: "POST",
      success: function (result) {
        let res = result.data
        if (res.errorCode === 0 && res.data.code=== 1) {    
            that.setData({
              msgxq:res.data.list[0]
            })
            if(res.data.list[0].ydzt==0){
              that.updateyd();
            }
        }
      },
      fail: function () {
        that.closeloading()
        that.opact("操作失败，请稍后再试");
      }
    })
  },
  	//转换为时间格式
    formatDate() {
      var date = new Date();
      var YY = date.getFullYear() + '-';
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
       return YY + MM + DD + " " + hh + mm + ss;
    },
  
  updateyd(){
    var that = this;
    var time =that.formatDate();
    wx.request({
      url: app.globalData.webroot + '/xcx/msg/updateyd',
      data: {
        ydsj: time,
        pid:that.data.pid
      },
      method: "POST",
      success: function (result) {

      },
      fail: function () {
        that.closeloading()
        that.opact("操作失败，请稍后再试");
      }
    })
  },
})