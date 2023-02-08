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
    wxuserInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(1111)
    var wxuserInfo = wx.getStorageSync('wxuserInfo') 
    this.setData({
      wxuserInfo: wxuserInfo,
      news_list:[],
      pagecount: 1, // 总页数
      pagesize: 6,
      curpage: 0,
    })
    
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
    // this.getXmlxList()
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


  toXmDetail(e) {
   if(e.currentTarget.dataset.item.shzt == '1' || e.currentTarget.dataset.item.sftj == '0'){
    return
   }else{
    let pid = e.currentTarget.dataset.xmid
    wx.navigateTo({
      url: '/pages/proinfo/proinfo?pid=' + pid + '&iffromMy=true',
    })
   }
  
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
      fbrid:that.data.wxuserInfo.pid,
      // fbrid:962,
      pagesize: that.data.pagesize,
      curpage: that.data.curpage,
      // c_newstype: that.data.newstype,
      e: new Date(),
      ...that.data.xmParams
    }

    wx.request({
      // url: app.globalData.webroot + '/xcx/data/getNewsListLimit.do',
      url: app.globalData.webroot + '/jbgs/back/jbgsgl/getFbrXmlistInfo',
      method: "POST",
      data: obj,
      success: function (res) {

        var json = res.data
        // console.log(json)
        if (json.errorCode === 0) {
          let resultData = json.data.outmap
          let list = []
          // console.log(resultData.list)
          list = [...that.data.news_list, ...resultData.list]

          that.setData({
            news_list: list,
            pagecount: resultData.pagecount,
            loading: false,
            // newsheight: height,
            xmSumCount: resultData.count
          })
          // console.log(that.data.news_list)
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
  opact: function (txt) {
    wx.showToast({
      title: txt,
      mask: false,
      icon: "none",
      duration: 2000
    });
  },


  //重新发榜
  cxfbReload(e){
    let params={
      pid : e.currentTarget.dataset.xmid,
      sftj:e.currentTarget.dataset.type
    }
    wx.navigateTo({
      url: '/pages/wyfb/wyfb?params=' +JSON.stringify(params)
    })
  },
  //结案按钮
  caseButton(e){
    let that = this
    let pid =e.target.dataset.xmid
    let jazt=e.target.dataset.type
    let jabz
    wx.showModal({
      title:'结案备注',
      content: "",
      cancelColor: '#000',
      showCancel: true,
      editable:true,
      placeholderText	:'请输入结案备注',
      success: function (res) {
        if (res.confirm) {
          if(res.content =='' || res.content == null){
            that.opact("结案备注不能为空"); 
            return
          }
          jabz=res.content
          wx.request({
            url: app.globalData.webroot + '/xcx/home/editXMCase',
            data: {
              e: new Date(),
              pid:pid,
              jazt:jazt,
              jabz:jabz
            },
            method: "POST",
            success: function (result) {
              that.onLoad()
              that.opact("操作成功");
            },
            fail: function () {
              that.closeloading()
              that.opact("操作失败，请稍后再试");
            }
          })
        } 
     
      }
     
    });
  
 },

 //项目下架
 shelvesXM(e){
   let that =this
  let pid =e.target.dataset.xmid
  wx.showModal({
    title:'项目下架',
    content: "是否确定下架本项目？",
    cancelColor: '#000',
    showCancel: true,
    success: function (res) {
      if (res.confirm) {
        wx.request({
          url: app.globalData.webroot + '/xcx/home/editXMshelves',
          data: {
            e: new Date(),
            pid:pid,
            sfxj:1
          },
          method: "POST",
          success: function (result) {
            that.onLoad()
            that.opact("操作成功");
          },
          fail: function () {
            that.closeloading()
            that.opact("操作失败，请稍后再试");
          }
        })
      } 
   
    }
   
  });
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
    // that.setData({
    //   xmParams: {
    //     xmlx: nowType,
    //     xmmc: that.data.searchKey
    //   }
    // })
    that.setData({
      curpage: 0,
      currentTab: new_currentTab
    })
    // console.log(that.data.xmParams);
    that.getList()
    // console.log(">>>>selectType结束>>>>>>>");

  },

  onReachBottom() {
    console.log('到最底下了')
    this.getList()
  }
})