// pages/proinfo/proinfo.js
const app = getApp();
const util = require('../../../utils/util.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    "title": "",
    "tag": "",
    "txt": "",
    "date": "",
    "filename": "",
    "add": "",
    "hasuser": true, // 是否有揭榜人
    "usertableinfo": [], // 整理后的揭榜人，一行3个
    "userinfo": [],
    "hasJieBang": false,
    wxuserInfo: {},
    user: {},
    yhid: "",
    fjList: [],
    lxr:"",
    lxfs :"",
    pid: 0,
    userInfo: {},
    downloadfileName: '',
    downloadUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      pid: options.pid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //用户信息
    this.getUserInfoFromStorage()

    // console.log(this.data.pid);

    this.getDetailById();

    // 这里是用来整理揭榜人信息的
    var usertableinfo = [];
    var hs = this.data.userinfo.length;
    hs = hs % 3 == 0 ? hs / 3 : parseInt(hs / 3) + 1; // 计算出总行数
    // 开始给每行添加信息
    for (var i = 0; i < hs; i++) {
      var itemlist = []
      for (var j = 0; j < 3; j++) {
        var ti = i * 3 + j;
        if (ti >= this.data.userinfo.length) {
          continue;
        }
        itemlist[j] = this.data.userinfo[ti]
      }
      usertableinfo[i] = itemlist;
    }
    this.setData({
      "usertableinfo": usertableinfo
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

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

  //拨打电话
  callPhone(e){
    //  let phone =  e.target.dataset.phone
    //  console.log(phone);
    //  console.log(this.data.lxfs);
     wx.makePhoneCall({
       phoneNumber: this.data.lxfs,
     })
    },
  //获取数据
  getDetailById() {
    var that = this
    wx.request({
      url: app.globalData.webroot + '/xcx/home/getXmInfoByIdWithShztall',
      data: {
        e: new Date(),
        pid: that.data.pid,
        yhid: that.data.yhid,
      },
      method: "GET",
      success: function (result) {
        let res = result.data
        if (res.errorCode === 0) {
          let json = res.data.data
          that.setData({
            title: json.xmmc,
            date: json.kssj.substring(0, 10),
            txt: json.xmnr,
            // filename: json.fjList[0] ? json.fjList[0] : "暂无附件",
            hasJieBang: res.data.hasJieBang,
            lxfs : json.lxfs ? json.lxfs : "",
            lxr : json.lxr ? json.lxr : ""
          })

          if (json.fjList && json.fjList.length > 0) {
            that.setData({
              fjList: json.fjList,
              filename: ""
            })
          } else {
            that.setData({
              filename: "暂无附件"
            })
          }
          console.log("that.data.fjList");
          console.log(that.data.fjList);

          if (json.xmlxList && json.xmlxList[0]) {
            // console.log(json.xmlxList);
            let str = ''
            for (let index = 0; index < json.xmlxList.length; index++) {
              const element = json.xmlxList[index];
              str += element.lxmc
              if (index != json.xmlxList.length - 1) {
                str += '>'
              }
            }
            that.setData({
              tag: str
            })
          }

          if (json.jbrList && json.jbrList[0]) {
            // let new_jbrList = []
            // for (let j = 0; j < json.jbrList.length; j++) {
            //   let new_jbrList_item = []
            //   if (j) {
            //     new_jbrList_item
            //   }
            // }
            // for (let index = 0; index < 4; index++) {
            //   json.jbrList = [...json.jbrList,...json.jbrList]

            // }

            that.setData({
              hasuser: true,
              usertableinfo: json.jbrList
            })

          } else {
            that.setData({
              hasuser: false,

            })
          }
          // "title": "我是标题",
          // "tag": "一级类别>二级类别",
          // "txt": "我是项目介绍，很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多",
          // "date": "2022-08-20",
          // "filename": "我是附件名称.doc",
          // "add": "我是地址信息，很长很长很长很长很长很长很长很长很长很长",
          // "hasuser": true, // 是否有揭榜人
          // "usertableinfo": [], // 整理后的揭榜人，一行3个
        }
      },
      fail: function () {
        that.closeloading()
        that.opact("操作失败，请稍后再试");
      }
    })
  },

  wyjbOne(e) {
    var that = this
    let xmid = e.currentTarget.dataset.xmid
    console.log(xmid);

    if (this.ifLogin()) {
      if (this.ifUserDisabled()) {
        wx.showModal({
          content: "该账户已被禁用！",
          cancelColor: '#000',
          showCancel: false,
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              //
            }
          }
        })
      } else {
        //揭榜


        wx.showModal({
          content: "是否确认揭榜?",
          cancelColor: '#000',
          showCancel: true,
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {

              wx.request({
                url: app.globalData.webroot + '/xcx/home/jiebang',
                data: {
                  xmid: xmid,
                  yhid: that.data.yhid,
                  e: new Date()
                },
                method: "GET",
                success: function (result) {
                  // console.log(res)
                  let res = result.data
                  // console.log(res);
                  if (res.errorCode === 0) {
                    that.opact("揭榜成功")
                    var json = res.data

                    // console.log(">>>>");
                    // console.log(json);
                    // that.setData({
                    //   headbanner_list: json.headBannerList,
                    // })
                    that.setData({
                      curpage: 0
                    })
                    that.getList()
                  } else {
                    that.opact(res.data.result)
                  }
                },
                fail: function () {
                  that.closeloading();
                  that.opact("获取信息失败，请稍后再试");
                }
              })
            }
          }
        })


      }
    } else {
      wx.showModal({
        content: "您尚未登录,请登录！",
        cancelColor: '#000',
        showCancel: true,
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.switchTab({
              url: '/pages/my/my/my',
            })
          }
        }
      })
    }
  },
  getUserInfoFromStorage() {
    this.setData({
      user: wx.getStorageSync("user"),
      wxuserInfo: wx.getStorageSync("wxuserInfo")
    })
    if (!this.objIsEmpty(this.data.wxuserInfo)) {
      this.setData({
        yhid: this.data.wxuserInfo.pid
      })
    }
  },
  //判断用户是否登录过
  ifLogin() {
    this.getUserInfoFromStorage()
    return this.data.wxuserInfo && this.data.wxuserInfo.phone
  },

  //判断用户是否禁用
  ifUserDisabled() {
    return this.data.wxuserInfo.jyzk !== '0'
  },

  //判断用户是否登录
  //loginPage：登录之后跳转的页面
  judgeUserLoginAndThen(loginPage) {
    if (this.ifLogin()) {
      if (this.ifUserDisabled()) {
        wx.showModal({
          content: "该账户已被禁用！",
          cancelColor: '#000',
          showCancel: false,
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              //
            }
          }
        })
      } else {
        //跳转发榜页面
        wx.navigateTo({
          url: loginPage,
        })
      }
    } else {
      wx.showModal({
        content: "您尚未登录,请登录！",
        cancelColor: '#000',
        showCancel: true,
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.switchTab({
              url: '/pages/my/my/my',
            })
          }
        }
      })
    }
  },
  objIsEmpty(obj) {
    return obj === undefined || obj === null || obj === ''
  },

  //下载
  downLoadFun: function (e) {
    let url =  e.target.dataset.url
    url = '/upload/1.png'
    var that = this;
    // var fileUrl = e.target.dataset.url;
    // fileUrl = fileUrl.replace(/,/g, '');
    console.log('查看');
    // 下载文件
    const downloadTask = wx.downloadFile({ //下载文件
      url: app.globalData.webroot + url,
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        console.log('res', res)
        if (res.statusCode === 200) {
          console.log('a', res);
          wx.saveFile({ //临时文件保存
            tempFilePath: res.tempFilePath,
            success(result) {
              const savedFilePath = result.savedFilePath
              console.log(savedFilePath, '11');
              if (savedFilePath) {
                wx.showToast({
                    title: '正在打开文件...',
                    icon: 'loading',
                    duration: 2000
                  }),
                  wx.openDocument({ //打开文件
                    filePath: savedFilePath,
                    success: function (res) {
                      console.log('打开文档成功', res)
                    }
                  })
              } else {
                wx.showToast({
                  title: '找不到文件路径！',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    });
  },


})