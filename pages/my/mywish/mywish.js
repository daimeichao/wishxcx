//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')
var   userInfo = {}
//wx.setStorageSync('wxuserInfo', json.user)
Page({
  data: {
    menulist:[
    ],
    length:"",
    pid:[],
    name:[],
    userid:[],
    content:[],
    adder:[],
    userinfo:[],
    img:'/img/mywish.png',
    hidden: true, //loading
    ifGetUserInfo: false, //是否获取用户信息
    ifgetuser: false, //是否获取用户信息
    gettelbtn: true, //获取手机号码
  },
  onLoad: function () {
    this.setData({
      userinfo:wx.getStorageSync("userInfo")
    })
    this.getSelectData();
  },
  onShow: function () {
    this.setData({
      registerflag:getApp().globalData.registerflag
    })
    var wxuserInfo = wx.getStorageSync('userInfo') // 数据库用户对象
    this.setData({
      userdata: wxuserInfo,
    })

    if (wxuserInfo=='' || wxuserInfo==null) {
      this.setData({
        ifGetUserInfo: false,
      })
    }else{
      this.setData({
        ifGetUserInfo: true,
      })
    }

    if (userInfo=='' || userInfo==null) {
      this.setData({
        ifgetuser: false,
      })
    }else{
      this.setData({
        ifgetuser: true,
      })
    }
    
  },
  ToPath1: function (e) {
    let pid = e.currentTarget.dataset.id; // 跳转传参的参数
    let state = e.currentTarget.dataset.state;
    console.log(state)
    if(state == "00" || state == "10" || state == "11"){
      wx.navigateTo({ 
        url: '/pages/my/wishDetail/wishDetail?pid='+pid
      })
    }
    if(state == "20"){
      wx.navigateTo({ 
        url: '/pages/my/wishDetailEdit/wishDetailEdit?pid='+pid
      })
    }
    if(state == "12"){
      wx.navigateTo({ 
        url: '/pages/my/wishmyfuil/wishmyfuil?pid='+pid
      })
    }

  },
  getSelectData: function () {
    var self =this;
    var id=this.data.userinfo.pid
    wx.request({
      url: app.globalData.Jweb + '/wish/mywish/getmywish',
      data: {
        pid:id
      },
      method: 'get',
      header: {
        'content-type': 'application/json;charset=UTF-8',
      },
      success: function (res) {
        var data1=res.data.data.data
        console.log(data1)
        for(var i =0;i<data1.length;i++){
          var dd = data1[i].wishTime
          data1[i].wishTime=dd.substr(0,10);
          self.data.menulist[i]=data1[i]
        }
        self.setData({
          menulist : self.data.menulist,
          length:self.data.menulist.length
        })
        console.log(self.data.length);
      },
      fail: function (e) {
        that.opact("操作失败，请稍后再试");
      }
    });
  },
  getUserProfile(e) {
    var that =this;
    var obj = wx.getStorageSync('user')
    console.log("obj",obj);
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("res",res)
        userInfo.openid = obj.openid;
        userInfo.nickName = res.userInfo.nickName;
        userInfo.avatarUrl = res.userInfo.avatarUrl;
        userInfo.usertel = "";

      //   var arrayall={
      //     array:that.data.array,
      //     arrayid:that.data.arrayid
      //   };

      //  var  arrayall =JSON.stringify(arrayall)
         console.log("userInfo111",userInfo)
        wx.setStorageSync('userInfo', userInfo);
        var str = JSON.stringify(userInfo);
        getApp().globalData.registerflag = 1
        wx.navigateTo({
          url: '/pages/my/myzhuce/myzhuce?userInfo=' + str +'&registerflag='+that.data.registerflag,
        })
      },
      fail: (res) => {
        that.opact("取消授权");
      }
    })
  },
  Tozhuce: function (e) {
    var that =this;
    console.log("this.data.ifGetUserInfo:" + this.data.ifGetUserInfo);
    if(this.data.ifGetUserInfo==false){
      that.getUserProfile();
    }
    
    
  },
  getDetail: function () {
    var that = this
    wx.request({
      url: app.globalData.webroot + "user/get",
      data: {
        pid: userbean.pid,
        jyzk: 0
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
    },
      fail: function () {
        
        that.setData({
          hidden: true,
        });
        that.opact("网络忙，请稍等重试~");
      },
      complete: function () {}
    })
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

})