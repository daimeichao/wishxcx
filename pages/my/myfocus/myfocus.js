// pages/home/activelist/activelist.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    webroot: app.globalData.webroot, // 获取路径
    userdata: {},
    userbq: "",
    formData: {

    },
    wxuserInfo: {},
    hidden: true, // 加载进行中

    selectArray: [],
    index: 0,
    array: [],
    arrayall: [],
    arrayid: [],
    range: [
      ["福建省"],
      ["福州市"],
      ["请选择", "鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "长乐区", "闽侯县", "连江县", "罗源县", "闽清县", "永泰县", "平潭县", "福清市"]
    ],
    multiIndex: [0, 0, 0],
    index1: 0,
    Schoolarray: [],
    Schoolarrayid: [],

    fromJb: false, //是否是揭榜完善信息跳转过来的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.fromJb) {
      this.setData({
        fromJb: options.fromJb
      })
    }

    var that = this;
    var wxuserInfo = wx.getStorageSync('wxuserInfo') // 数据库用户对象
    // var arrayall=JSON.parse(options.arrayall)
    that.setData({
      wxuserInfo: wxuserInfo,
      userdata: wxuserInfo,
      // arrayall:arrayall,
      // array:arrayall.array,
      // arrayid:arrayall.arrayid,
      formData: wxuserInfo,

    })

    // for(var i=0;i<that.data.arrayid.length;i++){
    //     if(that.data.arrayid[i]==wxuserInfo.rylbid){
    //       this.setData({
    //         index:i,
    //       });
    //     }
    // }
    for (var i = 0; i < 14; i++) {
      var that = this;

      if (that.data.range[2][
          [0, 0, i][2]
        ] == that.data.formData.yhloc) {
        that.setData({
          multiIndex: [0, 0, i],
        })

      }
    }




  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    this.getSchoolSelect();
    this.getSelectData();

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
  getSelectData: function () {
    var that = this;
    wx.request({
      url: app.globalData.webroot + '/user/getZwInfo',
      data: {},
      method: 'post',
      header: {
        'content-type': 'application/json;charset=UTF-8',
      },
      success: function (res) {

        var data1 = res.data.data.outmap.list
        var list = [];
        var list1 = [];
        for (var i = 0; i < data1.length; i++) {
          list.push(data1[i].text)
          list1.push(data1[i].id)
        }
        var arrayall = {
          array: list,
          arrayid: list1
        };
        that.setData({
          array: list,
          arrayid: list1,
          arrayall: arrayall
        })
        for (var i = 0; i < that.data.arrayid.length; i++) {
          if (that.data.arrayid[i] == that.data.wxuserInfo.rylbid) {
            that.setData({
              index: i,
            });
          }
        }
      },
      fail: function (e) {
        that.opact("操作失败，请稍后再试");
      }
    });
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
        console.log("that.data.wxuserInfo.byyx:" + that.data.wxuserInfo.byyx);
        if (that.data.wxuserInfo.byyx != '' && that.data.wxuserInfo.byyx != null) {
          for (var i = 0; i < that.data.Schoolarrayid.length; i++) {
            if (that.data.Schoolarrayid[i] == that.data.wxuserInfo.byyx) {
              that.setData({
                index1: i,
              });
            }
          }
        }
        console.log("that.data.index1:" + that.data.index1);
      },
      fail: function (e) {
        that.opact("操作失败，请稍后再试");
      }
    });
  },

  bindPickerChange: function (e) {

    var that = this
    this.setData({
      index: e.detail.value,
      'formData.rylbid': that.data.arrayid[e.detail.value]
    })
  },
  bindPickerChange1: function (e) {

    var that = this
    this.setData({
      index1: e.detail.value,
      'formData.byyx': that.data.Schoolarray[e.detail.value]
    })
  },
  bindMultiPickerChange: function (e) {
    var that = this

    if (e.detail.value[2] != 0) {
      that.setData({
        multiIndex: e.detail.value,
        'formData.yhloc': that.data.range[2][e.detail.value[2]]
      })
    } else {
      that.setData({
        multiIndex: e.detail.value,
        'formData.yhloc': ''
      })
    }

  },
  objIsEmpty(obj) {
    return obj === undefined || obj === null || obj === ''
  },
  checkPhone: function (phone) {
    // var regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;     //带区号校验
    var regPhone =
      /^((1[3,5,8,7,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/; //不带区号校验
    if (!this.objIsEmpty(phone) && regPhone.test(phone)) {
      return true;
    }
    return false;
  },
  inputFrame(e) {
    this.setData({
      [`${e.currentTarget.dataset.gater}`]: e.detail.value
    })
  },

  submit() {
    var that = this;
    let byyx = that.data.Schoolarrayid[that.data.index1]
    // console.log("byyx:" + byyx);
    if (that.data.fromJb) {
      if (that.data.formData.xm == '' || that.data.formData.xm == null) {
        that.opact("姓名不能为空");
        return
      }

      if (that.data.index1 == 0) {
        that.opact("所在院校不能为空");
        return
      }

      if (that.data.formData.zy == '' || that.data.formData.zy == null) {
        that.opact("专业不能为空");
        return
      }
    }

    // console.log("that.data.fromJb",that.data.fromJb); 
    if (!that.data.fromJb) {
      console.log("that.data.formData.phone",that.data.formData.phone);
      if (that.data.formData.phone === '' || that.data.formData.phone === null || that.data.formData.phone === undefined) {
        that.opact("联系方式不能为空");
        return
      }
      if(!that.checkPhone(that.data.formData.phone)){
        that.opact("联系方式格式不正确");
        return
      }
    }
    // if(that.data.formData.phone=='' || that.data.formData.phone==null){
    //   that.opact("联系方式不能为空"); 
    //   return
    // }

    // if (that.data.multiIndex[2] == 0) {
    //   that.opact("用户位置不能为空");
    //   return
    // }







    // if (that.data.formData.dw == '' || that.data.formData.dw == null) {
    //   that.opact("单位不能为空");
    //   return
    // }




    // if (that.data.formData.lzcs == '' || that.data.formData.lzcs == null) {
    //   that.opact("服务次数不能为空");
    //   return
    // }

    // if (that.data.formData.email == '' || that.data.formData.email == null) {
    //   that.opact("邮箱不能为空");
    //   return
    // }
    // if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(this.data.formData.email))) {
    //   that.opact("邮箱格式错误");
    //   return
    // }

    // if (that.data.formData.scyfkt === undefined || that.data.formData.scyfkt === '' || that.data.formData.scyfkt === null) {
    //   that.opact("个人/团队简介不能为空");
    //   return
    // }
    let hdjx0 = that.data.formData.hdjx.replaceAll('，', ',')

    let arr0 = hdjx0.split(",")
    // console.log("arr0", arr0);
    let arr1 = []
    for (let i = 0; i < arr0.length; i++) {
      const element = arr0[i];
      if (element === '' || element.trim() === '') {
        continue;
      }
      arr1.push(element.trim())
    }
    let hdjx1 = arr1.join(",")
    // console.log("hdjx1", hdjx1);

    that.setData({
      hidden: false,
      'formData.hdjx': hdjx1
    });

    wx.request({
      url: app.globalData.webroot + '/user/update',
      data: {
        pid: that.data.wxuserInfo.pid,
        xm: that.data.formData.xm,
        phone: that.data.formData.phone,
        // yhloc: that.data.formData.yhloc,
        dw: that.data.formData.dw,
        email: that.data.formData.email,
        // zycj: that.data.formData.zycj,
        // lzcs: that.data.formData.lzcs,

        // csly: that.data.formData.csly,
        scyfkt: that.data.formData.scyfkt,
        byyx: byyx,
        // tc: that.data.formData.tc,
        // rylbid: that.data.formData.rylbid,

        // jj: that.data.formData.jj,
        hdjx: that.data.formData.hdjx,
        // cgid: that.data.formData.cgid,
        // cgnr: that.data.formData.cgnr,
        zy: that.data.formData.zy,
      },
      method: 'post',
      header: {
        'content-type': 'application/json;charset=UTF-8',
      },
      success: function (res) {
        that.setData({
          hidden: true,
          'userdata.xm': that.data.formData.xm,
          'userdata.phone': that.data.formData.phone,
          'userdata.dw': that.data.formData.dw,
          'userdata.email': that.data.formData.email,
          'userdata.zycj': that.data.formData.zycj,
          'userdata.lzcs': that.data.formData.lzcs,

          'userdata.csly': that.data.formData.csly,
          'userdata.scyfkt': that.data.formData.scyfkt,
          'userdata.byyx': byyx,
          'userdata.tc': that.data.formData.tc,
          ' userdata.rylbid': that.data.formData.rylbid,

          ' userdata.jj': that.data.formData.jj,
          ' userdata.hdjx': that.data.formData.hdjx,
          'userdata.cgnr': that.data.formData.cgnr,
          'userdata.zy': that.data.formData.zy,
        });
        // console.log('wxuserInfo', that.data.userdata);
        wx.setStorageSync('wxuserInfo', that.data.userdata)

        if (that.data.fromJb) {
          wx.navigateBack()
        } else {
          wx.switchTab({
            url: '/pages/my/my/my'
          })
        }

      },
      fail: function () {
        that.opact("操作失败，请稍后再试");
      }
    });

  },

  sendLzcs: function () {
    var that = this;
    var regLzcs =
      /(^[0-9]*$)/;
    if (
      that.data.formData.lzcs != "" &&
      !regLzcs.test(that.data.formData.lzcs)
    ) {
      that.setData({
        'formData.lzcs': ""
      });
      that.opact("只能是数字");
    }
  },
  sendEmail: function () {
    var that = this;
    var regEmail =
      /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (
      that.data.formData.email != "" &&
      !regEmail.test(that.data.formData.email)
    ) {
      that.setData({
        'formData.email': ""
      });
      that.opact("邮箱格式不正确");
    }
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