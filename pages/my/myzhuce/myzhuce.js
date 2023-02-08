// pages/home/activelist/activelist.js
const app = getApp();
//var userInfo = wx.getStorageSync('userInfo', userInfo);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webroot: app.globalData.webroot, // 获取路径
    ifGetUserInfo: false,
    name:"",
    openid:"",
    userbq: "",
    userSetInfo: {
    },
    index: 0,
    array: [],
    arrayall: [],
    arrayid: [],
    multiIndex: [0, 0, 0],

    hidden: true, // 加载进行中
    registerflag: '',
    index1: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var wxuserInfo = wx.getStorageSync('userInfo') 
    this.setData({
      userdata: wxuserInfo,
      openid:wxuserInfo.openid
    })
    this.getSelectData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      registerflag: getApp().globalData.registerflag
      // registerflag:'1'
    })


  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  inputFrame(e) {
    var username=e.detail.value
    this.setData({
      name:username
    })
    console.log(this.data.name);
  },
  edituser(){
    var that =this
    wx.request({
      url: app.globalData.Jweb + '/wish/my/editinfo',
      method: 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        name:that.data.name,
        pid:that.data.pid
      },
      success: function (res) {
 
        if(res.data ===1){ // 成功
          wx.showToast({
            title: '成功',
            duration: 1000,
            success: function () {
            setTimeout(function () {
            wx.reLaunch({
            url: '/pages/my/my/my'
              })
            }, 1000);
           }
         })    
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
    
  },
  bindPickerChange: function (e) {
    var that = this
    this.setData({
      index: e.detail.value,
      'userSetInfo.rylbid': that.data.arrayid[e.detail.value]
    })
  },
  bindPickerChange1: function (e) {

    var that = this
    this.setData({
      index1: e.detail.value,
      'userSetInfo.byyx': that.data.Schoolarray[e.detail.value]
    })
  },

  bindMultiPickerChange: function (e) {
    var that = this
    this.setData({
      multiIndex: e.detail.value,
      'userSetInfo.yhloc': that.data.range[2][e.detail.value[2]]
    })
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

  submit() {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo', userInfo);

    if (that.data.userSetInfo.xm == '' || that.data.userSetInfo.xm == null) {
      that.opact("姓名不能为空");
      return
    }

    if (that.data.userSetInfo.rylbid == '' || that.data.userSetInfo.rylbid == null) {
      that.setData({
        'userSetInfo.rylbid': that.data.arrayid[0]
      })
    }
    let byyx = '';

    //我要揭榜独有
    if (!that.data.wyfb) {
      // if (that.data.registerflag == 1 && that.data.multiIndex[2] == 0) {
      //   that.opact("用户位置不能为空");
      //   return
      // }

      if (that.data.index1 == 0) {
        that.opact("所在院校不能为空");
        return
      }
      byyx = that.data.Schoolarrayid[that.data.index1];
      if (that.data.userSetInfo.zy == '' || that.data.userSetInfo.zy == null) {
        that.opact("专业不能为空");
        return
      }
    }
    //我要发榜独有
    if (that.data.wyfb) {
      if (that.data.registerflag == 1 && (that.data.userSetInfo.dw == '' || that.data.userSetInfo.dw == null)) {
        that.opact("单位不能为空");
        return
      }

      // if (!that.data.wyfb) {
      //   // if (that.data.userSetInfo.csly == '' || that.data.userSetInfo.csly == null) {
      //   //   that.opact("擅长领域不能为空");
      //   //   return
      //   // }

      //   // if (that.data.registerflag == 1 && (that.data.userSetInfo.lzcs == '' || that.data.userSetInfo.lzcs == null)) {
      //   //   that.opact("服务次数不能为空");
      //   //   return
      //   // }
      // }
      if (that.data.registerflag == 1 && (that.data.userSetInfo.email == '' || that.data.userSetInfo.email == null)) {
        that.opact("邮箱不能为空");
        return
      }

      if (that.data.registerflag == 1 && !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(that.data.userSetInfo.email))) {
        that.opact("邮箱格式错误");
        return
      }
    }


    that.setData({
      hidden: false
    });


    if (that.data.registerflag == 0) {
      wx.request({
        url: app.globalData.webroot + '/user/add1',
        data: {
          openid: that.data.userSetInfo.openid,
          zhmc: that.data.userSetInfo.zhmc,
          tx: that.data.userSetInfo.tx,
          phone: that.data.userSetInfo.phone,
          xm: that.data.userSetInfo.xm,
          csly: that.data.userSetInfo.csly,
          rylbid: that.data.userSetInfo.rylbid,
          byyx: byyx,
          hdjx: that.data.userSetInfo.hdjx,
          zy: that.data.userSetInfo.zy,
        },
        method: 'post',
        header: {
          'content-type': 'application/json;charset=UTF-8',
        },
        success: function (res) {
          // console.log('wxuserInfo' , that.data.data.data);
          wx.setStorageSync('wxuserInfo', res.data.data.data)
          // that.getDetail()
          that.setData({
            hidden: true
          });

          wx.switchTab({
            url: '/pages/home/home/home',
          })
        },
        fail: function (e) {
          that.setData({
            hidden: true
          });
          console.log(e)
          that.opact("操作失败，请稍后再试");
        }
      });
    } else {
      wx.request({
        url: app.globalData.webroot + '/user/add1',
        data: {
          openid: that.data.userSetInfo.openid,
          zhmc: that.data.userSetInfo.zhmc,
          tx: that.data.userSetInfo.tx,
          phone: that.data.userSetInfo.phone,
          xm: that.data.userSetInfo.xm,
          csly: that.data.userSetInfo.csly,
          rylbid: that.data.userSetInfo.rylbid,

          yhloc: that.data.userSetInfo.yhloc,
          dw: that.data.userSetInfo.dw,
          email: that.data.userSetInfo.email,
          zycj: that.data.userSetInfo.zycj,
          lzcs: that.data.userSetInfo.lzcs,
          scyfkt: that.data.userSetInfo.scyfkt,
          byyx: byyx,
          tc: that.data.userSetInfo.tc,


          jj: that.data.userSetInfo.jj,
          hdjx: that.data.userSetInfo.hdjx,
          cgnr: that.data.userSetInfo.cgnr,
          zy: that.data.userSetInfo.zy,
        },
        method: 'post',
        header: {
          'content-type': 'application/json;charset=UTF-8',
        },
        success: function (res) {
          wx.setStorageSync('wxuserInfo', res.data.data.data)
          that.setData({
            hidden: true
          });
          if (that.data.fromJb) {
            wx.navigateBack()
          }else if(that.data.wyfb){
            wx.navigateTo({
              url: "/pages/wyfb/wyfb",
            })
          } else {
            wx.switchTab({
              url: '/pages/home/home/home',
            })
          }

        },
        fail: function (e) {
          that.setData({
            hidden: true
          });
          console.log(e)
          that.opact("操作失败，请稍后再试");
        }
      });
    }


  },

  sendLzcs: function () {
    var that = this;
    var regLzcs =
      /(^[0-9]*$)/;
    if (
      that.data.userSetInfo.lzcs != "" &&
      !regLzcs.test(that.data.userSetInfo.lzcs)
    ) {
      that.setData({
        'userSetInfo.lzcs': ""
      });
      that.opact("只能是数字");
    }
  },
  getDetail: function () {
    var that = this
    that.setData({
      hidden: false
    });
    wx.request({
      url: app.globalData.webroot + "user/getInfo1",
      data: {
        openid: that.data.userSetInfo.openid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=UTF-8',
      },
      success: function (res) {
        var resdata = res.data.data
        if (resdata.data != null) {
          // console.log('wxuserInfo',resdata.data);
          wx.setStorageSync('wxuserInfo', resdata.data)
        }
        that.setData({
          hidden: true,
        });
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

  // 获取用户电话号码
  getPhoneNumber(e) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (e.detail.errMsg == "getPhoneNumber:ok") {
          var ency = e.detail.encryptedData;
          var iv = e.detail.iv;
          wx.request({
            url: app.globalData.webroot + '/xcx/main/getphone',
            data: {
              encryptedData: ency,
              iv: iv,
              session_key: wx.getStorageSync("user").session_key
            },

            success: function (res) {
              if (res.data.phoneNumber) {
                that.setData({
                  'userSetInfo.phone': res.data.phoneNumber,
                });
                that.submit();
              } else {
                that.opact("操作失败，请稍后再试");
              }
            },
            fail: function () {
              that.opact("操作失败，请稍后再试");
            }
          });
        }
      },
      fail: function (res) {
        that.opact("用户状态超时，请重试");
        wx.login({
          success: function (res) {
            //code 获取用户信息的凭证
            if (res.code) {
              //请求获取用户openid
              wx.request({
                url: app.globalData.webroot + '/xcx/main/wxinfo',
                data: {
                  "code": res.code
                },
                method: 'post',
                header: {
                  'Content-type': 'application/json;charset=utf-8'
                },
                success: function (res) {
                  console.log('code交换解密到的数据--', res)
                  var json = res.data
                  if (json.openid) {
                    var obj = {};
                    obj.openid = json.openid;
                    obj.session_key = json.session_key;
                    obj.unionid = json.unionid;
                    wx.setStorageSync('user', obj)
                  } else {
                    var res2 = {
                      status: 505,
                      err: json.errmsg
                    }
                    resolve(res2);
                  }
                },
                fail: function (err) {
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

      }
    })

  },
  getSchoolSelect: function () {
    var that = this;
    wx.request({
      url: app.globalData.webroot + '/user/getSchoolInfo',
      data: {},
      method: 'post',
      header: {
        'content-type': 'application/json;charset=UTF-8',
      },
      success: function (res) {

        var data1 = res.data.data.outmap.list
        that.setData({
          Schoolarray: data1.shoollist,
          Schoolarrayid: data1.shoolidlist,
        })

      },
      fail: function (e) {
        that.opact("操作失败，请稍后再试");
      }
    });
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