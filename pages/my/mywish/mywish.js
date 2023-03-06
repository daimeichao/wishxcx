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
    userdata:{},
    img:'/img/mywish.png',
    hidden: true, //loading
  },
  onLoad: function () {
    this.setData({
      userdata:wx.getStorageSync("userInfo")
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
    console.log("走这里 eee",e)
    let pid = e.currentTarget.dataset.id; // 跳转传参的参数
    let state = e.currentTarget.dataset.state;
    console.log(state)
    if(state == "00" || state == "10" || state == "11"){
      wx.navigateTo({ 
        url: '/pages/my/wishDetail/wishDetail?pid='+pid
      })
    }
   else if(state == "20"){
      wx.navigateTo({ 
        url: '/pages/my/wishDetailEdit/wishDetailEdit?pid='+pid
      })
    }
   else if(state == "12"){
      wx.navigateTo({ 
        url: '/pages/my/wishmyfuil/wishmyfuil?pid='+pid
      })
    }

  },
  getSelectData: function () {
    var self =this;
    // var id=self.data.userdata.pid
    wx.request({
      url: app.globalData.Jweb + '/wish/mywish/getmywish',
      data: {
        pid:self.data.userdata.pid
      },
      method: 'get',
      header: {
        'content-type': 'application/json;charset=UTF-8',
      },
      success: function (res) {
        var data1=res.data.data.data
        console.log(res,"datat11111")
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