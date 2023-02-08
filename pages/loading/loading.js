//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    hidden: true,
    n_pid: null,
    userInfo:{
      name:"",
      nick:'',
      portrait:'',
      openid:'',
      isShow:false
    }
  },
  onLoad: function (options) {
    let that = this

    let userOpenId = wx.getStorageSync("openid");
    console.log('openid:'+userOpenId);
    if(userOpenId !== null && userOpenId !== '' && userOpenId !==undefined ){
      that.userIsExist()
    }else{
      wx.login({
        success: function(res){
          if(res.code){
            //发起网络请求
            console.log('-------res.code------:'+res.code);
            wx.request({
              method: 'post',
              header: {
                'Content-type': 'application/json;charset=utf-8'
              },
              url: app.globalData.webroot + 'xcx/main/wxinfo',
              data: {
                code: res.code,
              },
              success: function (res) {
                
                let openid = res.data.openid;
                console.log('-------openid------:'+openid);
                //let openid = 'o_Hl45RIKN6UE2M7TDqOyQYAndVQ';
                let session_key = res.data.session_key;
                app.globalData.openid = openid
                app.globalData.session_key = session_key
                wx.setStorageSync("openid", openid);
                wx.setStorageSync("session_key", session_key);
                console.log(wx.getStorageSync("openid"))
                console.log(wx.getStorageSync("session_key"))
                // 判断用户是否存在
                // get userinfo
                that.userIsExist()
              },
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
       })
    }


  
  },


  userIsExist :function(){
    let that = this
    wx.request({
      url: app.globalData.webroot + 'xcx/api/getUserByOpenId', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        // 'Content-Type': "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        openId: wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res)
        let data = res.data.data
        let userInfo ={}
        if(data.resultCode === 2000 ){
          if(data.isUser){ // 返回用户信息
            userInfo =data.userInfo
            // save goto index
            console.log('----------------------userInfo---------------------') 
            console.log(userInfo)

            if(userInfo.jyzk === '1' || userInfo.jyzk ===1){
              app.toast("账号被禁用")
            }else{
              wx.setStorageSync("userInfo", userInfo);
              wx.redirectTo({
                url:'/pages/index/index'
              })
            }
         
          }else{ // 没有用户信息手动添加
              that.setData({
                isShow:true
              })
          }
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

  addUser :function(param){
    wx.request({
      url: app.globalData.webroot + 'xcx/api/addUser', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        // 'Content-Type': "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
      }, // 设置请求的 header
      // data: {
      //   openId:app.globalData.openid
      // },'
      data:this.data.userInfo,
      success: function (res) {
        console.log(res)
        let data = res.data.data
        let userInfo ={}
        if(data.resultCode === 2000 ){
          wx.setStorageSync("userInfo", data.userInfo);
          wx.redirectTo({
            url:'/pages/index/index'
          })
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


  getUserProfileNew: function (e) {
    var that  = this
    var that = this
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.data.userInfo.nick = res.userInfo.nickName;
        this.data.userInfo.portrait = res.userInfo.avatarUrl;
        this.data.userInfo.openid  = wx.getStorageSync("openid")
        this.setData({
           userInfo: this.data.userInfo,
        })
        this.addUser()
      },
      fail: (res) => {
     
      }
    })
  },

})
