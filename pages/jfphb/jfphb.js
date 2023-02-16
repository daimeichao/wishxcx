// pages/jfphb/jfphb.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phblist:[],
    total:''

  },
  getDetail(){
    var that =this 
    // use api
    wx.request({
      url: app.globalData.webroot + 'xcx/api/getphb', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        pageindex: 1,
        pagesize: that.data.pageSize,
      },
      success: function (res) {
        console.log("排行榜res",res)
        let result = res.data.data
        if(result.resultCode == 2000){ // 成功
          let resultList =  result.wishList
          that.setData({
            phblist: resultList,
            total: result.total
          })
          if(resultList === null || resultList.length===0){
            that.setData({
              showText: '暂无数据',
            })
          }
  
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
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