//app.js
const util = require('utils/util.js')
App({
  userLogin: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      let user = wx.getStorageSync("user");
      if (user == null || user == undefined || user.openid == null) {
        wx.login({
          success: function (res) {
            //code 获取用户信息的凭证
            if (res.code) {
              //请求获取用户openid
              wx.request({
                url: that.globalData.webroot + '/xcx/main/wxinfo',
                data: { 
                  "code": res.code
                },
                method: 'post',
                header: {
                  'Content-type': 'application/json;charset=utf-8'
                },
                success: function (res) {
                  console.log('code交换解密到的数据--',res)
                  var json = res.data
                  if (json.openid) {
                    var obj = {};
                    obj.openid = json.openid;
                    obj.session_key = json.session_key;
                    obj.unionid = json.unionid;
                    wx.setStorageSync('user', obj)
                    that.IfExistClient().then(
                    function(res){
                      if (res != null) {
                        resolve(res);
                      }
                    }
                    )
                  }else{
                    var res2 = {
                      status: 505,
                      err: json.errmsg
                    }
                    resolve(res2);
                  }
                }, fail: function (err) {
                  wx.showToast({
                    title: JSON.stringify(err),
                    mask: false,
                    icon: "none",
                    duration: 1000
                  });                 
                },
              });
            } else {
              reject('获取用户登录态失败');
            }
          }
        })
      }else{
        that.IfExistClient().then(
        function(res){
          if (res != null) {
            resolve(res);
          }
        })
      }
    })
  },
  IfExistClient: function(){ // 是否存在该openid
    let user = wx.getStorageSync("user")
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.globalData.webroot + "/xcx/main/ifexistuser",
        data: {
          c_openid: user.openid, // openid
          t: new Date()
        },
        method: 'post',
        header: {
          'Content-type': 'application/json;charset=utf-8'
        },
        success: function (res) {
          var json = res.data
          if (json.user != null) {
            console.log("用户信息");
            console.log(json);
            var ip = "";
            var city = "";
            wx.request({
              url: "http://pv.sohu.com/cityjson?ie=utf-8",
              data: {
                t: new Date()
              },
              method: 'post',
              header: {
                'Content-type': 'application/json;charset=utf-8'
              },
              success: function (res) {
                console.log(res)
                var data = JSON.parse( res.data.substring(19,res.data.length-1));
            ip = data.cip;
            city = data.cname;
            let cs = {
            czmc:"登录手机端",
            czrid:json.user.pid,
            czrmc:json.user.xm,
            czrip:ip,
            city:city
          }
          wx.request({
            url: that.globalData.webroot + '/log/add',
            data: cs,
            method: 'post',
            header: {
              'Content-type': 'application/json;charset=utf-8'
            },
            success: function (res) {
              console.log("日志添加成功");
            }, fail: function (err) {               
            },
          });
              },
              fail: function (err) {
                
              },
              complete: function () {
              }
            })
            wx.setStorageSync('wxuserInfo', json.user)
          }
          resolve(res);
        },
        fail: function (err) {
          console.log(err)
          var res2 = {
            status: 505,
            err: '保存用户openid异常'
          }
          resolve(res2);
        },
        complete: function () {
        }
      })
    })
  },

        /**
   * 获取参数
   */
    updParam(e) {
      console.log(e.currentTarget.dataset.key)
      console.log(e.detail.value)
    let key = e.currentTarget.dataset.key;
    let param = {}
    param[key] = e.detail.value
    return param
  },

     /**
   * 提示弹窗
   */
  toast: function (title) {
    wx.showToast({
      icon: 'none',
      title: title,
      duration: 2000
    });
    //模拟取消
    setTimeout(function () {
      wx.hideToast();
    }, 1000);
  },

  globalData: {
    userInfo: null, 
    // webroot:'https://hxjtg.fzjiading.com/wxy-api/',
    // Jweb:'https://hxjtg.fzjiading.com/wxy-api/',
    webroot:'http://localhost:8127/',
    Jweb:'http://localhost:8127/',
    openid: '', // openid
    user: {}, // 用户
    p_n_id: '1', // 项目id
    proid: '1', // 项目id
    userInfo: null,
    usertag: 0, // 0表示什么都没拉取过，1是拉取过主信息，2是拉取过电话
    registerflag:0,// 0普通注册，1详细注册
    rankJumpParamsObj:{
        fbdw :"",
        jbrinfo:"",
        schoolName:"",
    },
  }
})
