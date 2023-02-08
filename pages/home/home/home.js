// pages/home/home/home.js
const app = getApp();
const util = require('../../../utils/util.js')
var ency, iv, openid, session_key;
var userInfo;
var usertel;
var uid;
var tag;

var userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: app.globalData.webroot + "upload/banner.png",
    webroot: app.globalData.webroot, // 获取路径
    loging: false, // 盖层
    headbanner_list: [], // 头部轮播图list

    userbtn: true, //获取用户信息
    gettelbtn: true, //获取手机号码
    consult_banner_list: [], // 咨询轮播

    currentTab: 1,
    news_list: [], // 新闻列表
    newstype: '',
    newsheight: 200, // 新闻列表的高度
    currentIndex: 0,
    statusBarHeight: 44,
    loading: false,
    finished: false,
    pagecount: 1, // 总页数
    pagesize: 6,
    curpage: 0, // 当前页


    // 
    fbCount: 0, //榜单数
    jbCount: 0, //揭榜数
    jbjeCount: 0, //揭榜金额
    rzzjCount: 0, //入住专家数量
    xmlxList: [],
    xmParams: {
      xmlx: ""
    },
    xmSumCount: 0,
    searchKey: "",
    zxInfo: {}, //最新资讯信息
    latestZxid: 0, //最新资讯id
    user: {},
    wxuserInfo: {},
    yhid: "",
    config: {},
    clickIndex: "", //我要揭榜的index
    bzdxList: [], //榜单资讯集合


    //
    pid: "", //当前点击的项目id,
    bdxzshow: false,
    checkshow: true,
    checkItems: [{
      value: 'yes',
      name: '我已阅读榜单须知'
    }, ],
    checkValue: "",

    //详情页返回有没有揭榜过
    jieBangXmid: -1,
    ifNeedReFresh: true,
    ifGetUserInfo: false, //是否获取用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //用户信息
    this.getUserInfoFromStorage()
    this.getHeadBannerList()


    //还原
    this.setData({
      currentTab: 1,
      xmParams: {
        xmlx: ''
      }
    })
    this.getShowData()
    this.setData({
      curpage: 0
    })
    this.getList()

    //获取最新资讯
    this.getLatestZx()
    //榜单须知
    this.bdxz()

    this.setData({
      ifNeedReFresh: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //点击导航栏会刷新
    // if (this.data.ifNeedReFresh) {
    //   this.onLoad()
    //   return
    // }
    this.getUserInfoFromStorage()
    //重置
    this.setData({
      ifNeedReFresh: true
    })

    // console.log("onshow");
    this.setData({
      bdxzshow: false,
      checkValue: "",
      checkshow: true,
    })


    this.setData({
      jieBangXmid: !this.objIsEmpty(wx.getStorageSync('jieBangXmid')) ? wx.getStorageSync('jieBangXmid') : -1

    })
    let storageClickIndex = wx.getStorageSync('storageClickIndex')
    // console.log(">storageClickIndex<:" + storageClickIndex);
    // console.log(">jieBangXmid<:" + this.data.jieBangXmid);
    if (this.data.jieBangXmid > 0 && !this.objIsEmpty(storageClickIndex)) {
      this.getShowData()
      this.setData({
        clickIndex: storageClickIndex
      })
      this.updateClickXmInfo(this.data.jieBangXmid)
    }




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onRefresh: function () {
    //导航条加载动画
    wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: 'Loading...',
    })
    this.onLoad()
    setTimeout(function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 2000)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onRefresh();
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log("页面隐藏");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("页面卸载");
  },





  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  switch (e) {
    // console.log()
    var index = e.currentTarget.dataset.index
    if (index == '0') {
      this.setData({
        currentIndex: 1
      })
    } else if (index == '1') {
      this.setData({
        currentIndex: 0
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
    // console.log("wxuserInfo");
    // console.log(this.data.wxuserInfo);
    // console.log(this.data.yhid);
    // console.log("wxuserInfo");
  },

  //判断用户是否登录过
  ifLogin() {
    this.getUserInfoFromStorage()
    return this.data.wxuserInfo && this.data.wxuserInfo.phone
  },

  //获取数据
  getShowData() {
    var that = this
    wx.request({
      url: app.globalData.webroot + '/xcx/home/getShowData',
      data: {
        e: new Date()
      },
      method: "POST",
      success: function (result) {
        let res = result.data
        // console.log(res);
        if (res.errorCode === 0) {
          var json = res.data
          that.setData({
            fbCount: json.fbCount
          })
          that.setData({
            jbCount: json.jbCount
          })
          that.setData({
            jbjeCount: json.jbjeCount ? Math.round(json.jbjeCount / 10000) : 0
          })
          that.setData({
            rzzjCount: json.rzzjCount
          })
          if (json.xmlxList && json.xmlxList.length > 0) {
            that.setData({
              xmlxList: json.xmlxList
            })
          }
        }
      },
      fail: function () {
        that.closeloading()
        that.opact("操作失败，请稍后再试");
      }
    })
  },
  //榜单须知
  ShowNotice(e) {
    // wx.showModal({
    //   cancelColor: '#000',
    //   confirmText: "确认",
    //   showCancel: false,
    //   content: this.data.config.bdxz ? this.data.config.bdxz : "榜单须知",
    // })
    this.setData({
      bdxzshow: true,
      checkshow: false
    })
  },
  selectType(e) {
    let nowType = e.target.dataset.pid
    let new_currentTab = e.target.dataset.current
    // console.log("nowType:" + nowType, typeof nowType);
    var that = this;
    // console.log(that.data.currentTab);
    // if (that.data.currentTab === new_currentTab) {
    //   console.log("相等返回");
    //   return false;
    // }
    this.setData({
      news_list: [],
      newsheight: 100,
      newstype: nowType,
      // currentTab : new_currentTab
    })

    // var c_newstype = e.currentTarget.dataset.current
    that.setData({
      xmParams: {
        xmlx: nowType
      }
    })
    that.setData({
      curpage: 0,
      currentTab: new_currentTab
    })
    // console.log("selectType :that.data.curpage:" + that.data.curpage);
    that.getList()
    // console.log(">>>>selectType结束>>>>>>>");

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

  /**
   * 打开等待盖层
   */
  openloading: function (e) {
    this.setData({
      loging: true
    });
    wx.showLoading({
      title: e,
    });
  },
  /**
   * 各个轮播图跳转
   */
  toJump(e) {
    var type = e.currentTarget.dataset.type
    var url = e.currentTarget.dataset.url
    var pid = e.currentTarget.dataset.pid
    if (url != '' && url != null) {
      wx.navigateTo({
        url: '/pages/bannerDetail/banner?url=' + url,
      })
    }

    // if (type == '0') {
    // wx.navigateTo({
    //   url: '/pages/bannerDetail/banner?url=' + url,
    // })
    // } else if (type == '1') {
    //   if (url) {
    //     app.globalData.weburl = url
    //     wx.navigateTo({
    //       url: '/pages/web/web',
    //     })
    //   }
    // } else if (type == '2') {
    //   if (url) {
    //     wx.reLaunch({
    //       url: url,
    //     })
    //   }
    // }
  },
  toJump2(e) {
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    var url = e.currentTarget.dataset.url
    // console.log(type, url, id)
    if (type == '1') {
      if (url) {
        app.globalData.weburl = url
        wx.navigateTo({
          url: '/pages/web/web',
        })
      }
    } else if (type == '2') { // 自定义
      wx.navigateTo({
        url: '/pages/home/text/text?p_n_id=' + id,
      })
    }
  },
  /**
   * 关闭等待盖层
   */
  closeloading: function () {
    this.setData({
      loging: false
    });
    wx.hideLoading();
  },


  toSearch(e) {
    this.setData({
      searchKey: e.detail.value
    })
    wx.navigateTo({
      url: '/pages/jbdt/jbdt?searchKey=' + this.data.searchKey,
    })
  },
  toSearchByType() {
    wx.navigateTo({
      // url: '/pages/jbdt/jbdt?nowType=' + this.data.newstype + "&currentTab=" + this.data.currentTab  + '&autoFocus=true',
      url: '/pages/jbdt/jbdt?nowType=' + '' + "&currentTab=" + 1 + '&autoFocus=true',
    })
  },
  toSearchByType2() {
    // wx.navigateTo({
    // url: '/pages/jbdt/jbdt?nowType=' + this.data.newstype + "&currentTab=" + this.data.currentTab,
    // })
    wx.switchTab({
      url: '/pages/jbdt/jbdt'
    })
  },
  toJbrfc() {
    wx.switchTab({
      url: '/pages/jbrfc/jbrfc/jbrfc'
    })
  },
  //判断用户是否禁用
  ifUserDisabled() {
    console.log("禁用状态：" + this.data.wxuserInfo.jyzk);
    return this.data.wxuserInfo.jyzk !== '0'
  },

  //判断用户是否登录
  //loginPage：登录之后跳转的页面
  judgeUserLoginAndThen(loginPage) {
    var that = this;
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
        // //跳转发榜页面
        // if (that.data.wxuserInfo.dw == "" || that.data.wxuserInfo.dw == null || that.data.wxuserInfo.yhloc == "" || that.data.wxuserInfo.yhloc == null) {
        //   wx.showModal({
        //     content: "请先完善个人信息！",
        //     cancelColor: '#000',
        //     showCancel: true,
        //     success: function (res) {
        //       if (res.cancel) {
        //         //点击取消,默认隐藏弹框
        //       } else {
        //         getApp().globalData.registerflag = 1;
        //         wx.navigateTo({
        //           url: '/pages/my/myfocus/myfocus',
        //         })
        //       }
        //     }
        //   })
        // } else {
          wx.navigateTo({
            url: loginPage,
          })
        // }
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
            getApp().globalData.registerflag = 1;
            // wx.switchTab({
            //   url: '/pages/my/my/my',
            // })
            that.Tozhuce()
          }
        }
      })
    }
  },

  getUserProfile(e) {
    var that = this;
    var obj = wx.getStorageSync('user')
    console.log("obj", obj);
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("res", res)
        userInfo.openid = obj.openid;
        userInfo.nickName = res.userInfo.nickName;
        userInfo.avatarUrl = res.userInfo.avatarUrl;
        userInfo.usertel = "";

        //   var arrayall={
        //     array:that.data.array,
        //     arrayid:that.data.arrayid
        //   };

        //  var  arrayall =JSON.stringify(arrayall)
        // console.log("userInfo111", userInfo)
        wx.setStorageSync('userInfo', userInfo);
        var str = JSON.stringify(userInfo);
        wx.navigateTo({
          url: '/pages/my/myzhuce/myzhuce?userInfo=' + str + '&registerflag=' + that.data.registerflag + '&wyfb=true'
        })
      },
      fail: (res) => {
        that.opact("取消授权");
      }
    })
  },
  Tozhuce: function (e) {
    if (this.data.ifGetUserInfo == false) {
      this.getUserProfile();
    }
  },

  wyfb() {
    this.judgeUserLoginAndThen('/pages/wyfb/wyfb')
  },
  wyjb() {
    wx.switchTab({
      url: '/pages/jbdt/jbdt',
    })

  },


  //获取Banner列表
  getHeadBannerList() {
    var that = this
    wx.request({
      url: app.globalData.webroot + '/xcx/home/getHeadBannerList',
      data: {
        e: new Date()
      },
      method: "POST",
      success: function (result) {
        // console.log(res)
        let res = result.data
        // console.log(res);
        if (res.errorCode === 0) {
          var json = res.data
          // console.log(">>>>");
          // console.log(json);
          that.setData({
            headbanner_list: json.headBannerList,
          })

          // console.log(that.data.headbanner_list);
          // if (json.xmlxList && json.xmlxList.length > 0) {
          //   that.setData({
          //     xmlxList: json.xmlxList
          //   })
          // }
        }
      },
      fail: function () {
        that.closeloading();
        that.opact("获取信息失败，请稍后再试");
      }
    })
  },
  bdxz() {
    var that = this
    wx.request({
      url: app.globalData.webroot + '/xcx/home/bdxz',
      data: {
        e: new Date()
      },
      method: "GET",
      success: function (result) {
        // console.log(res)
        let res = result.data
        // console.log(res);
        if (res.errorCode === 0) {
          var json = res.data


          // console.log(json.zxInfo);
          that.setData({
            config: json.data,
          })

          // console.log("that.data.config");
          // console.log(that.data.config);
          // if (json.xmlxList && json.xmlxList.length > 0) {
          //   that.setData({
          //     xmlxList: json.xmlxList
          //   })
          // }
        }
      },
      fail: function () {
        that.closeloading();
        that.opact("获取信息失败，请稍后再试");
      }
    })
  },
  getLatestZx() {
    var that = this
    wx.request({
      url: app.globalData.webroot + '/xcx/home/getFiveZx',
      data: {
        e: new Date()
      },
      method: "POST",
      success: function (result) {

        let res = result.data
        // console.log(res);
        if (res.errorCode === 0) {
          var json = res.data
          wx: for (var i = 0; i < json.zxInfo.length; i++) {
            json.zxInfo[i].tjsj = json.zxInfo[i].tjsj.substring(0, 10)
          }
          // console.log(json.zxInfo);
          that.setData({
            bzdxList: json.zxInfo,
            latestZxid: json.zxInfo[0].pid
          })

          // console.log(that.data.zxInfo);
          // if (json.xmlxList && json.xmlxList.length > 0) {
          //   that.setData({
          //     xmlxList: json.xmlxList
          //   })
          // }
        }
      },
      fail: function () {
        that.closeloading();
        that.opact("获取信息失败，请稍后再试");
      }
    })
  },
  toZxDetail(e) {
    wx.navigateTo({
      url: '/pages/zxdt/zxdtxq/zxdtxq?pid=' + e.currentTarget.dataset.pid,
    })
  },

  toZxList(e) {
    wx.navigateTo({
      url: '/pages/zxdt/zxdt/zxdt',
    })
  },

  toXmDetail(e) {
    this.setData({
      ifNeedReFresh: false
    })
    let index = e.currentTarget.dataset.index

    // console.log("存入 缓存clickIndex:" + index);
    //把clickIndex 存入 缓存
    wx.setStorageSync('storageClickIndex', index)

    let pid = e.currentTarget.dataset.xmid
    wx.navigateTo({
      url: '/pages/proinfo/proinfo?pid=' + pid,
    })

  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.setData({
      curpage: 0,
      newstype: e.detail.current
    })
    // console.log(e.detail.current)
    var c_newstype = e.detail.current
    wx.request({
      url: app.globalData.webroot + '/xcx/data/getNewsList.do',
      data: {
        c_newstype: c_newstype,
        curpage: that.data.curpage,
        pagesize: that.data.pagesize,
        e: new Date()
      },
      success: function (res) {
        // console.log(res)
        var json = res.data
        if (json.list.length > 0) {
          var height = 400;
          if (json.list.length % 2 == 0) {
            height = height * (json.list.length / 2);
          } else {
            height = height * (parseInt(json.list.length / 2) + 1);
          }
          // console.log(that.data.news_list)
        }
        that.setData({
          news_list: json.list,
          pagecount: json.pagecount,
          newsheight: height,
          currentTab: e.target.dataset.current
        })
      },
      fail: function () {
        that.closeloading();
        that.opact("获取信息失败，请稍后再试");
      }
    });


  },
  //点击切换
  clickTab: function (e) {
    this.setData({
      news_list: [],
      newsheight: 100,
      newstype: e.target.dataset.current
    })
    var that = this;
    var c_newstype = e.currentTarget.dataset.current
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else if (e.target.dataset.current === '4') {
      app.globalData.weburl = this.data.webroot + '/index.html#/newslist'
      wx.navigateTo({
        url: '/pages/web/web',
      })
    } else if (e.target.dataset.current === '5') {
      var link = "https://www.ly.com/scenery/zhuanti/fuzhou2022H5/";
      if (link) {
        app.globalData.weburl = link
        wx.navigateTo({
          url: '/pages/web/web',
        })
      }
      // 跳转同程旅游小程序
      // wx.navigateToMiniProgram({
      //   appId: 'wx336dcaf6a1ecf632',
      //   path: '/page/home/webview/webview?src=https%3A%2F%2Fwx.17u.cn%2Fwl%2Fapi%2Fredirect%3Fredirect_uri%3Dhttps%253A%252F%252Fwww.ly.com%252Fscenery%252Fzhuanti%252Ffuzhout%253Fisxcx%253D1',
      //   extraData: {},
      //   envVersion: 'release',
      //   success(res) {
      //     // 打开成功
      //   }
      // })
    } else {
      that.setData({
        curpage: 0
      })
      wx.request({
        // url: app.globalData.webroot + '/xcx/data/getNewsListLimit.do',
        url: app.globalData.webroot + '/xcx/data/getNewsList.do',
        data: {
          pagesize: that.data.pagesize,
          curpage: that.data.curpage,
          c_newstype: c_newstype,
          e: new Date()
        },
        success: function (res) {
          // console.log(res)
          var json = res.data
          if (json.list.length > 0) {
            var height = 400;
            if (json.list.length % 2 == 0) {
              height = height * (json.list.length / 2);
            } else {
              height = height * (parseInt(json.list.length / 2) + 1);
            }
            // console.log(that.data.news_list)
          }
          that.setData({
            news_list: json.list,
            newsheight: height,
            pagecount: json.pagecount,
            currentTab: e.target.dataset.current
          })
        },
        fail: function () {
          that.closeloading();
          that.opact("获取信息失败，请稍后再试");
        }
      });
    }
  },
  // 点击详情
  clickNews(e) {
    // console.log(e.currentTarget.dataset.bean)
    var bean = e.currentTarget.dataset.bean
    var c_type = bean.c_type
    if (c_type === "1") {
      // 跳链接，也看过了
      wx.request({
        url: app.globalData.webroot + '/xcx/data/getNewsById.do',
        data: {
          p_n_id: bean.p_n_id,
          e: new Date()
        },
        success: function (res) {},
        fail: function () {
          that.closeloading();
          that.opact("获取信息失败，请稍后再试");
        }
      });
      app.globalData.weburl = bean.c_link
      wx.navigateTo({
        url: '/pages/web/web',
      })
    } else if (c_type === "2") { // 自定义
      //  用vue
      app.globalData.weburl = this.data.webroot + '/index.html#/newsdetail?p_n_id=' + bean.p_n_id
      wx.navigateTo({
        url: '/pages/web/web',
      })
    }
  },
  toCultureHeritage(e) {
    var link = this.data.projectbean.c_whyclink
    app.globalData.weburl = link
    wx.navigateTo({
      url: '/pages/web/web',
    })

    // wx.navigateTo({
    //   url: '/pages/home/cultureheritagelist/cultureheritagelist',
    // })
  },
  // 图书借阅
  toBookLeading() {
    if (this.data.projectbean.c_line_book) {
      // app.globalData.weburl = this.data.projectbean.c_line_book
      // wx.navigateTo({
      //   url: '/pages/web/web',
      // })
    }
    wx.navigateToMiniProgram({
      appId: 'wxc13f8ae700d70393', //   wxb9e059d1e12d5372 wxc13f8ae700d70393
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  toCultureActive() {
    if (this.data.projectbean.c_line_CultureActive) {
      app.globalData.weburl = this.data.projectbean.c_line_CultureActive
      wx.navigateTo({
        url: '/pages/web/web',
      })
    }
  },

  updateClickXmInfo(xmid) {
    // console.log("updateClickXmInfo");
    var that = this
    wx.request({
      url: app.globalData.webroot + '/xcx/home/getXmInfoByIdWithShzt2',
      data: {
        e: new Date(),
        pid: xmid,
        yhid: that.data.yhid,
        // yhid: th.data.wxuserInfo.pid
      },
      method: "GET",
      success: function (result) {
        let res = result.data
        // console.log(res);
        if (res.errorCode === 0) {
          let json = res.data.data

          // console.log("?????");
          // console.log(that.data.clickIndex);
          let nowClickIndex = that.data.clickIndex
          // console.log(that.data.news_list[nowClickIndex]);
          let jbr_list = json.jbrList ? json.jbrList : []
          that.setData({
            // title: json.xmmc,
            // date: json.kssj.substring(0, 10),
            // txt: json.xmnr,
            // // filename: json.fjList[0] ? json.fjList[0] : "暂无附件",
            // hasJieBang: res.data.hasJieBang
            // [`news_list[${nowClickIndex}]`]: json,
            [`news_list[${nowClickIndex}].jbrList`]: jbr_list,
            [`news_list[${nowClickIndex}].canClick`]: !res.data.hasJieBang,
            [`news_list[${nowClickIndex}].jbrCount`]: res.data.jbrCount, //不在项目json里面
            [`news_list[${nowClickIndex}].IHasJieBang`]: res.data.IHasJieBang,
          })
          // console.log(res.data.hasJieBang);
          // console.log("????---?");

          // if (json.xmlxList && json.xmlxList[0]) {
          //   // console.log(json.xmlxList);
          //   let str = ''
          //   for (let index = 0; index < json.xmlxList.length; index++) {
          //     const element = json.xmlxList[index];
          //     str += element.lxmc
          //     if (index != json.xmlxList.length - 1) {
          //       str += '>'
          //     }
          //   }
          //   // that.setData({
          //   //   tag: str
          //   // })
          // }
          // if (!that.objIsEmpty(wx.getStorageSync('jieBangXmid'))) {
          //   that.setData({
          //     [`news_list[${nowClickIndex}].IHasJieBang`]: true,
          //   })
          // }
          wx.setStorageSync('jieBangXmid', '')
        }
      },
      fail: function () {
        that.closeloading()
        that.opact("操作失败，请稍后再试");
      }
    })
  },
  getList() {
    let that = this;
    if (that.data.curpage === 0) {
      that.setData({
        news_list: []
      })
    }
    if (that.data.curpage >= that.data.pagecount && that.data.pagecount != 0) {
      that.setData({
        finished: true
      })
      return
    }
    that.setData({
      loading: true
    })
    that.data.curpage++
    var obj = {
      pagesize: that.data.pagesize,
      curpage: that.data.curpage,
      c_newstype: that.data.newstype,
      e: new Date(),
      yhid: that.data.yhid,
      ...that.data.xmParams
    }
    wx.request({
      // url: app.globalData.webroot + '/xcx/data/getNewsListLimit.do',
      url: app.globalData.webroot + '/jbgs/back/jbgsgl/getXmlistWithJbrInfo',
      method: "POST",
      data: obj,
      success: function (res) {
        var json = res.data
        if (json.errorCode === 0) {
          let resultData = json.data.outmap
          let list = that.data.news_list

          list = [...that.data.news_list, ...resultData.list]
          // console.log(list)
          for (let i = 0; i < list.length; i++) {
            //判断开始时间
            if (that.objIsEmpty(list[i].kssj)) {
              list[i].kssj = ""
              list[i].canClick = false
            } else {

              if (new Date(list[i].kssj).getTime() < new Date().getTime()) {
                list[i].canClick = true
              } else {
                list[i].canClick = false
              }
            }

            //判断截止时间
            if (that.objIsEmpty(list[i].jzsj)) {
              //没有截止时间不管
            } else {

              //当前时间超过截止时间 
              if (new Date(list[i].jzsj).getTime() < new Date().getTime()) {
                list[i].canClick = false
              }
            }

            //是否已经揭榜过
            if (list[i].hasJieBang) {
              list[i].canClick = false
            }
          }

          that.setData({
            news_list: list,
            pagecount: resultData.pagecount,
            loading: false,
            // newsheight: height,
            xmSumCount: resultData.count
          })

          if (that.data.curpage >= that.data.pagecount) {
            that.setData({
              finished: true
            })
          }

        } else {
          that.setData({
            finished: true
          })
          that.opact("获取信息失败，请稍后再试");
        }
      },
      fail: function () {
        that.closeloading();
        that.opact("获取信息失败，请稍后再试");
      }
    });
  },

  objIsEmpty(obj) {
    return obj === undefined || obj === null || obj === ''
  },


  /** 我要揭榜 */
  cancalBtn() {
    // console.log("cancalBtn");
    this.setData({
      bdxzshow: false,
      checkValue: "",
      checkshow: true,
    })
  },
  confirmBtn() {
    if (!this.data.checkshow) {
      this.setData({
        bdxzshow: false,
        checkValue: "",
        checkshow: true,
      })
      return
    }
    if (this.data.checkValue.length == 0) {
      this.opact("请勾选我已阅读榜单须知")
      return
    }
    this.wyjbOneClick()
  },
  checkboxChange(e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checkValue: e.detail.value
    })
  },
  wyjbOne(e) {
    // let xmid = e.currentTarget.dataset.xmid
    // let index = e.currentTarget.dataset.index
    this.setData({
      ifNeedReFresh: false
    })
    let index = e.currentTarget.dataset.index

    //把clickIndex 存入 缓存
    wx.setStorageSync('storageClickIndex', index)

    // this.setData({
    //   // bdxzshow: true,
    //   pid: xmid,
    //   clickIndex: index
    // })
    //跳转详情
    let pid = e.currentTarget.dataset.xmid
    wx.navigateTo({
      url: '/pages/proinfo/proinfo?pid=' + pid,
    })

  },
  wyjbOneClick() {
    var that = this
    let xmid = this.data.pid
    console.log(xmid);

    if (this.ifLogin()) {
      if (this.ifUserDisabled()) {
        that.opact("该账户已被禁用！")
      } else {
        //揭榜
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
                // curpage: 0,
                bdxzshow: false,
                checkValue: '',
                checkshow: true,
              })







              // that.setData({
              //   curpage: 0
              // })
              that.getShowData()
              // that.getList()

              //就更新当前的
              that.updateClickXmInfo(xmid)
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
    } else {
      wx.showModal({
        content: "您尚未登录,请登录！",
        cancelColor: '#000',
        showCancel: true,
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            getApp().globalData.registerflag = 0,
              wx.switchTab({
                url: '/pages/my/my/my',
              })
          }
        }
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // console.log('到最底下了')
    //连续两次请求 有可能打扰了list顺序
    if (this.data.loading == true) {
      // console.log("在加载了");
      return
    }
    // console.log('不在加载开始加载')
    this.getList()
  },



  todel(e) {
    var that = this;
    let xmid = e.currentTarget.dataset.xmid

    let index = e.currentTarget.dataset.index

    this.setData({
      // bdxzshow: true,
      pid: xmid,
      clickIndex: index
    })

    wx.showModal({
      content: "是否取消揭榜?",
      cancelColor: '#000',
      showCancel: true,
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {

          wx.request({
            url: app.globalData.webroot + '/xmlx/delJbxmbyYhid',
            method: "POST",
            header: {
              'content-type': 'application/json;charset=UTF-8',
            },
            data: {
              yhid: that.data.wxuserInfo.pid,
              xmid: xmid
            },
            success: function (result) {
              // console.log(res)
              let res = result.data
              // console.log(res);
              if (res.errorCode === 0) {

                that.opact("取消成功")

                // wx.setStorageSync('jieBangXmid', that.data.pid)
                wx.setStorageSync('jieBangXmid', '')

                that.setData({
                  // curpage: 0,
                  bdxzshow: false,
                  checkValue: "",
                  checkshow: true,
                })
                that.getShowData()
                that.updateClickXmInfo(xmid)
              } else {
                that.opact(res.data.result)
              }
            },
            fail: function () {
              that.opact("取消失败，请稍后再试");
            }
          })
        }
      }
    })
  },








})