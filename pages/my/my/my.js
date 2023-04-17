//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')
var   userInfo = {}
//wx.setStorageSync('wxuserInfo', json.user)
Page({
  data: {
    appmain: app.globalData.webroot,
    pid:1,
    openid:"",
    projectbean: {},
    menulist: [{
        id: '1',
        img: '/img/mywish.png',
        name: '我的许愿',
        path: '/pages/my/myfocus/myfocus',
        show: '1'
      },
      {
        id: '2',
        img: '/img/myfuil.png',
        name: '我的完愿',
        path: '/pages/my/myapply/myapply',
        show: '1'
      },
      {
        id: '3',
        img: '/img/myinfo.png',
        name: '个人信息',
        path: '/pages/my/myzhuce/myzhuce',
        show: '1'
      },
      {
        id: '4',
        img: '/img/zs.png',
        name: '我的积分',
        path: '/pages/my/myjf/jfxq',
        show: '1'
      },
      {
        id: '5',
        img: '/img/zyzsq.png',
        name: '志愿者申请',
        path: '/pages/my/zyzsqinfo/sqinfo',
        show: '1'
      },
      {
        id: '6',
        img: '/img/goods.png',
        name: '注册',
        path: '/pages/register/register',
        show: '1'
      },
    ],
  
    hidden: true, //loading
    userdata:  {},
  
    registerflag:''
  },
  onLoad: function () {
    var wxuserInfo = wx.getStorageSync('userInfo') 
    this.setData({
      userdata: wxuserInfo,
      openid:wxuserInfo.openid
    })
    this.getDetail()
  },
  onShow: function () {
    this.getDetail()
  },

  getDetail(){
    var that =this 
    // use api
    wx.request({
      url: app.globalData.webroot + 'xcx/api/getUserById', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        // pid:that.data.pid
        pid:that.data.userdata.pid
      },
      success: function (res) {
        let result = res.data.data
        result.detail.portrait=app.globalData.webroot +result.detail.portrait
        if(result.resultCode ===2000){ // 成功
          that.setData({
         userdata:result.detail
          })
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },
  ToPath1: function (e) {
    // var that = this;
    // if(that.data.ifGetUserInfo==false){
    //   that.getUserProfile();
    // }else{
      var id = e.currentTarget.dataset.id
      if(id==1){
        wx.navigateTo({
          // url: '/pages/my/mywish/mywish?pid=' + this.data.pid
          url: '/pages/my/mywish/mywish?pid=' + this.data.userdata.pid
        })
      } 
      if(id==2){
        wx.navigateTo({
          url: '/pages/my/myfulfill/myfulfill?pid=' +  this.data.userdata.pid
        })
      }
      if(id==3){
        wx.navigateTo({
          url: '/pages/my/myzhuce/myzhuce?pid=' + this.data.userdata.pid
        })
      }
      if(id==4){
        wx.navigateTo({
          url: '/pages/my/myjf/jfxq?pid=' +  this.data.userdata.pid
        })
      }
      if(id==5){
        wx.navigateTo({
          url: '/pages/my/zyzsqinfo/sqinfo?pid=' +  this.data.userdata.pid
        })
      }
      if(id==6){
        wx.navigateTo({
          url: '/pages/register/register?pid=' +  this.data.userdata.pid
        })
      }
  },


  /**
   * 提示文字
   */
  opact: function (txt) {
    wx.showToast({
      title: txt,
      mask: false,
      icon: "none",
      duration: 2000
    });
  },

  toPageR(e){
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: url,
    }) 
  },

})