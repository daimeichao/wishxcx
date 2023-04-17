const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    is_shoucang: 0,
    imgherf:"app.globalData.webroot",
    map: {},
    pid: "",
    url:"",
    goods_info: {
      goods_id: 1,
      goods_title: "商品标题1",
      goods_price: '100',
      goods_yunfei: 0,
      goods_kucun: 100,
      goods_xiaoliang: 1,
      content: '商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情'
    },
    goods_img: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  onLoad: function (options) {
    this.setData({ 
      pid:options.pid,
      userInfo:wx.getStorageSync("userInfo")
    })

    console.log("pid " + this.data.pid)
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
      url: app.globalData.webroot + 'xcx/api/getgooddetail', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        pid:that.data.pid
      },
      success: function (res) {
        let result = res.data.data
        result.detail.url=app.globalData.webroot+result.detail.url
        if(result.resultCode ===2000){ // 成功
          that.setData({
            map:result.detail,
          })
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },
  previewImage: function (e) {
    console.log("eeee",e)
    var current = e.target.dataset.src;
    var href = this.data.imgherf;
    var goodsimg = this.data.map.url;
    var imglist = [goodsimg];
    // var imglist = [href+goodsimg];
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imglist // 需要预览的图片http链接列表  
    })
  },
  buy(){
    // var that =this 
    wx.request({
      url: app.globalData.webroot + 'xcx/api/buysp', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
       changenum:this.data.map.spprice,
       userid:1,
       remark:this.data.map.spname,
       sppid:this.data.map.pid,
       kc:this.data.map.kc-1
      },
      success: function (res) {
        let result = res.data.data
        if(result.resultCode ===2000){ // 成功
          app.toast("购买成功，等待管理员审核")

          setTimeout(function () {
            wx.redirectTo({
              url:'/pages/goods/goods'
            })
          }, 1000)
        
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },
})
