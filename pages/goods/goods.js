// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    menulist: [{
      id: '1',
      img: '/img/mywish.png',
      name: '心愿广场',
      path: '/pages/index/index',
      show: '1'
    },
    {
      id: '2',
      img: '/img/pm.png',
      name: '积分排行榜',
      path: '/pages/jfphb/jfphb',
      show: '1'
    },
    {
      id: '3',
      img: '/img/goods.png',
      name: '积分商城',
      path: '/pages/goods/goods',
      show: '1'
    },
    {
      id: '4',
      img: '/img/zyzsq.png',
      name: '申请志愿者',
      path: '/pages/zyzsq/zyzsq',
      show: '1'
    },
  ],
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getBannerList()
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
    this.getWishList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getBannerList(){
    var that = this
    wx.request({
      url: app.globalData.webroot + 'xcx/api/getBannerList', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        // 'Content-Type': "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        
      },
      success: function (res) {
        console.log(res.data.data)
        let data = res.data.data
        if(data.resultCode === 2000){
          let bannerList =  data.bannerLilst
          that.setData({
            bannerList:bannerList,
          })
        }else{

        }
      },
      fail: function () {
        // 接口调用失败的回调函数

      },
      complete: function () {
        // 接口调用结束的回调函数（调用成功、失败都会执行）

      }
    })
  },
  getWishListFirst(){
    var that =this 

    wx.request({
      url: app.globalData.webroot + 'xcx/api/getWishList', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        // 'Content-Type': "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
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


 
  toPage(e){
    var url = e.currentTarget.dataset.url
  
    wx.navigateTo({
      url: url
    })
    
  },

  toPageR(e){
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: url,
    }) 
  },



})