const app = getApp();
Page({
  data: {
    userdata:{},
    list:[],
    pageNo:1,
    pageSize:10,
    total:0,
    webroot:app.globalData.webroot
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
    console.log("================userInfo====================")
    console.log( wx.getStorageSync("userInfo"));
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getWishListFirst()
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
    this.getWishListFirst()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getWishListFirst(){
    var that =this 

    wx.request({
      url: app.globalData.webroot + 'xcx/my/getmyjf', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        // 'Content-Type': "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        pid:that.data.userdata.pid,
        pageindex: 1,
        pagesize: that.data.pageSize,
      },
      success: function (res) {
        let result = res.data.data
        if(result.resultCode == 2000){ // 成功
          let resultList =  result.wishList
          that.setData({
            list: resultList,
            total: result.total
          })
          if(resultList === null || resultList.length===0){
            that.setData({
              showText: '暂无数据',
            })
          }
  
        } else{ // 失败
 
        }
      },
    })
  },
})