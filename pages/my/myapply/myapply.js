// pages/jbdt/jbdt.js
const app = getApp();
const util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    webroot: app.globalData.webroot, // 获取路径
    searchKey: "",
    autoFocus: false,
    newstype: '',
    xmlxList: [],
    xmParams: {
      xmlx: "",
      xmmc: ""
    },
    xmSumCount: 0,
    loading: false,
    finished: false,
    pagecount: 1, // 总页数
    pagesize: 6,
    curpage: 0, // 当前页
    news_list: [], // 列表
    currentTab: 1,
    searchXmmc: "",
    wxuserInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var wxuserInfo = wx.getStorageSync('wxuserInfo')
    this.setData({
      wxuserInfo: wxuserInfo
    })
    // let searchKey = options.searchKey === undefined ? '' : options.searchKey
    // let autoFocus = options.autoFocus === undefined ? false : options.autoFocus
    // // console.log(searchKey);
    // let nowType = options.nowType === undefined ? '' : options.nowType
    // let nowCurrentTab = options.currentTab === undefined ? 1 : options.currentTab
    // // console.log(nowType);
    // this.setData({
    //   searchKey: searchKey,
    //   currentTab: nowCurrentTab,
    //   autoFocus: autoFocus,
    //   xmParams: {
    //     xmlx: nowType,
    //     xmmc: searchKey
    //   },
    //   curpage: 0
    // })
    this.getXmlxList()
    this.getList()
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

  SearchXm(e) {
    this.setData({
      searchKey: e.detail.value,
      curpage: 0
    })
    console.log("SearchXm");
    console.log(this.data.searchKey);
    var that = this
    this.setData({
      xmParams: {
        xmlx: that.data.newstype,
        xmmc: that.data.searchKey,

      },

    })
    this.getList()
  },
  todel(e) {
    var that = this;
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
              xmid: e.currentTarget.dataset.xmid
            },
            success: function (result) {
              // console.log(res)
              let res = result.data
              // console.log(res);
              if (res.errorCode === 0) {
                that.setData({
                  curpage: 0
                })
                that.opact("取消成功")
                that.getList()
                // wx.switchTab({ url: '/pages/my/my/my' })
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
  toXmDetail(e) {
    let pid = e.currentTarget.dataset.xmid
    wx.navigateTo({
      url: '/pages/proinfo/proinfo?pid=' + pid + '&iffromMy=true',
    })
  },
  getList() {

    let that = this;
    // console.log("that.data.curpage: " + that.data.curpage, typeof that.data.curpage);
    // console.log("that.data.pagecount: " + that.data.pagecount, typeof that.data.pagecount);
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
      yhid: that.data.wxuserInfo.pid,
      // yhid: 1168,
      pagesize: that.data.pagesize,
      curpage: that.data.curpage,
      // c_newstype: that.data.newstype,
      e: new Date(),
      ...that.data.xmParams
    }
    // console.log("obj", obj);
    // console.log(obj);
    wx.request({
      // url: app.globalData.webroot + '/xcx/data/getNewsListLimit.do',
      url: app.globalData.webroot + '/jbgs/back/jbgsgl/getJbrXmlistInfo',
      method: "POST",
      data: obj,
      success: function (res) {
        // console.log("res", res)
        var json = res.data
        if (json.errorCode === 0) {

          // console.log(333);
          // console.log(json);
          // console.log(resultData);
          // console.log(444);
          let resultData = json.data.outmap
          let list = that.data.news_list

          list = [...that.data.news_list, ...resultData.list]

          // if (resultData.list.length > 0) {
          //   var height = 400;
          //   if (list.length % 2 == 0) {
          //     height = height * (list.length / 2);
          //   } else {
          //     height = height * (parseInt(list.length / 2) + 1);
          //   }
          // }
          // console.log("list");
          // console.log(list);
          that.setData({
            news_list: list,
            pagecount: resultData.pagecount,
            loading: false,
            // newsheight: height,
            xmSumCount: resultData.count
          })
          console.log("news_list", that.data.news_list)
          console.log(that.data.pagecount);
          console.log(that.data.curpage);
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

  //榜单须知
  ShowNotice(e) {
    console.log(e);
    wx.showModal({
      cancelColor: '#000',
      confirmText: "确认",
      showCancel: false,
      content: "榜单须知",
    })
  },

  //获取数据
  getXmlxList() {
    var that = this
    wx.request({
      url: app.globalData.webroot + '/xcx/home/getXmlxList',
      data: {
        e: new Date()
      },
      method: "POST",
      success: function (result) {
        let res = result.data
        // console.log(res);
        if (res.errorCode === 0) {
          var json = res.data
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
        xmlx: nowType,
        xmmc: that.data.searchKey
      }
    })
    that.setData({
      curpage: 0,
      currentTab: new_currentTab
    })
    // console.log(that.data.xmParams);
    that.getList()
    // console.log(">>>>selectType结束>>>>>>>");

  },
  opact: function (txt) {
    wx.showToast({
      title: txt,
      mask: false,
      icon: "none",
      duration: 2000
    });
  },
  onReachBottom() {
    console.log('到最底下了')
    this.getList()
  }
})