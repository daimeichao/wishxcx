//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')
var   userInfo = {}
//wx.setStorageSync('wxuserInfo', json.user)
Page({
  data: {
    appmain: app.globalData.webroot,
    pid:"",
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
        path: '/pages/my/zyzsq/zyzsq',
        show: '1'
      },
      {
        id: '6',
        img: '/img/goods.png',
        name: '我的兑换',
        path: '/pages/my/mygoods/mygoods',
        show: '1'
      },
    ],
    array:[],
    arrayid:[],
    arrayall:{},
    hidden: true, //loading
    userdata: [],
    ifGetUserInfo: false, //是否获取用户信息
    ifgetuser: false, //是否获取用户信息
    gettelbtn: true, //获取手机号码
    registerflag:''
  },
  onLoad: function () {
    var wxuserInfo = wx.getStorageSync('userInfo') 
    this.setData({
      userdata: wxuserInfo,
      openid:wxuserInfo.openid
    })
    this.getSelectData();
  },
  onShow: function () {

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
          pid:res.data.data.data[0].pid
        })
      },
      fail: function (e) {
        that.opact("操作失败，请稍后再试");
      }
    });
  },
  ToPath1: function (e) {
    // var that = this;
    // if(that.data.ifGetUserInfo==false){
    //   that.getUserProfile();
    // }else{
      var id = e.currentTarget.dataset.id
      if(id==1){
        wx.navigateTo({
          url: '/pages/my/mywish/mywish?pid=' + this.data.pid
        })
      } 
      if(id==2){
        wx.navigateTo({
          url: '/pages/my/myfulfill/myfulfill?pid=' + this.data.pid
        })
      }
      if(id==3){
        wx.navigateTo({
          url: '/pages/my/myzhuce/myzhuce?pid=' + this.data.pid
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