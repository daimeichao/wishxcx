// pages/wishDetail/wishDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:"",
    detail:{},
    userInfo:{},
    pic:[],
    isshow:false
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
    this.getUrl()
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
      url: app.globalData.Jweb + '/wish/mywish/getfullwishbyidnew', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        pid:that.data.pid
      },
      success: function (res) {
        let result = res.data
        console.log(result.data.data,"111111wishr");
        if(result.status ==="success"){ // 成功
          var dds=result.data.data;
          dds.wishTime= dds.wishTime.substr(0,10);
          dds.sxtime= dds.sxtime.substr(0,10);
          that.setData({
            detail:dds,
            //detail.url=app.globalData.Jweb+detail.url
          })
          let resultss=that.data.detail
          console.log(that.data.detail);
          if(that.data.detail.claimantAuditRemark.length != 0){
            that.setData({
              isshow:true
            })
          }
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },

  getUrl(){
    var that =this 
    // use api
    wx.request({
      url: app.globalData.Jweb + '/wish/mywish/geturlbypidnew', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        pid:that.data.pid
      },
      success: function (res) {
        let result = res.data.data
        //console.log('00000-:'+that.data.pid);
        //console.log('result-:'+result);
        if(result.result ==="操作成功"){ // 成功
          that.data.pic = result.data
          for(var i =0;i<result.data.length;i++){
            that.data.pic[i]=app.globalData.Jweb+result.data[i].url
          }
          that.setData({
            pic : that.data.pic
          })
          console.log(that.data.pic);
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },

  imgview:function(e){
    let picture = e.currentTarget.src
    wx.previewImage({
      current: picture, 
      urls: this.data.pic,
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