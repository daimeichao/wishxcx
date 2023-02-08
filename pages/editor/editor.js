// pages/editor/editor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    title: "",
    html: "",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      title: options.title ? options.title : "保存内容"
    })



    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()



          }
        })
      }, duration)
      //

    })
    if (options.html) {
      options.html = ".嘀咕饭否的分隔符"
      that.setData({
        html: options.html
      })
    }
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
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context

      //
      wx.pageScrollTo({
        scrollTop: 0,
        success: () => {
          that.editorCtx.scrollIntoView()
        }
      })
      if (!res || !that.data.html) return
      that.editorCtx.setContents({
        html: that.data.html,
        success: result => {
          console.log('初始化内容成功 ', result)
        },
        fail: err => {
          console.log('初始化内容失败 ', err)
        }
      })

    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clickLogText(e) {
    that.editorCtx.getContents({
      success: function (res) {
        console.log(res.html)
        wx.setStorageSync("content", res.html); // 缓存本地
        console.log(res.html)
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        // console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '100%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },
  // 发布
  release() {
    this.editorCtx.getContents({
      success: (res) => {
        console.log(res)
        // db.collection('clock').where({ "_id": "79550af2603f463b08172d5813948f37" })
        // .update({
        //   data: {
        //     content: _.push({ date: util.formatTime(new Date()).substring(0, 10),content: res.html }),
        //   },
        //   success: res => {
        //     wx.navigateTo({
        //          url: '../../show/show'
        //    })
        //  }
        // })
        // console.log("succ：", res);
      },
    });
    console.log("文章发布")
  },
})