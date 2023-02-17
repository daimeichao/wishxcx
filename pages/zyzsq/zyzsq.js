// pages/realizationWish/realizationWish.js\
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sqsj:"",
    date:'',
    time:'',
    pid:'',
    userInfo:{},
    reason:"",
    zyzname:"",
    imageList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      pid:options.pid,
      userInfo:wx.getStorageSync("userInfo")
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
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sqsj: e.detail.value
    })
  },
  //自定义方法
  getParam: function (e) {
    this.setData(app.updParam(e))
  },


  realizationWish(){
    var that =this 
    if(that.data.sqsj === null ||that.data.sqsj==='' ){
      app.toast('请选择时间')
      return 
    }
console.log(that.data.zyzname);
    if(that.data.zyzname === null ||that.data.zyzname ==='' ){
      //app.toast('请输入认领人')
      //return 
      this.setData({
        zyzname: that.data.userInfo.name
      })
    }
    console.log('----'+that.data.zyzname);
    // use api
    wx.request({
      url: app.globalData.webroot + '/zyz/addzyz', //上线的话必须是https，没有appId的本地请求貌似不受影响 
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        "Content-Type": "application/json",
      }, // 设置请求的 header
      data: {
        // pid:that.data.pid,
        tx:that.data.imageList[0],
        // zyzname:that.data.userInfo.name,
        zyzname:that.data.zyzname,
        // zyzid:that.data.userInfo.pid,
        zyzid:1,
        sq_time:that.data.sqsj,
        reason:that.data.reason,
        zyz_audit_remark:''
      },
      success: function (res) {
        let result = res.data.data
        if(result.resultCode ===2000){ // 成功
         
          let resultId = result.wishClaimant.pid
          // uploadFile
          let imageList = that.data.imageList
          imageList.forEach(element => {
            wx.uploadFile({
              url: 'xcx/api/fileupload', //仅为示例，非真实的接口地址
              filePath: element,
              name: 'file',
              header: {
                'Content-Type': "application/x-www-form-urlencoded",
              }, // 设置请求的 header
              formData: {
              'path':'xy',
              'zyzid': resultId,
              'name':''
              // `task_file_type` int DEFAULT NULL COMMENT '附件类型(0为任务主表附件，1为子表提交附件)',
              },
              success: function (res) {
                var data = res.data
                console.log(data)
            
              }
            })
          });

          app.toast('操作成功')

          setTimeout(function () {
            wx.reLaunch({ url: "/pages/my/my" });
          }, 1000);


         
        }else{ // 失败
          app.toast(result.message)
        }
      },
    })
  },


  img_w_show :function(){
    console.log('img_w_show')
    var _this=this;
    let headers = {
      'Content-Type': "multipart/form-data"
    };
    wx.chooseImage({
        success: function (res) {				       					
          var tempFilePaths = res.tempFilePaths
          // tempFilePaths.forEach(element => {
          //   var fileName = element.name.toLowerCase();
          //   var suffix = fileName.split('.').pop();
          //   element.ext =  suffix
          // });
          
          _this.setData({
            imageList: _this.data.imageList.concat(tempFilePaths)
          })

          console.log('-----------imageList----------')
          console.log(_this.data.imageList)
        },				
    });		
  },

    //预览图片
    previewImage: function (e) {
      let that = this 
      
      var list = [] 
      that.data.imageList.forEach(element => {
        // if(element.ext === 'jpg' || element.ext === 'png'){
          list.push(element)
        // }
      });
      console.log('---------------------list-------------------------')
      console.log(list)

      wx.previewImage({
          current: e.target.dataset.path,//当前点击的图片链接
          urls: list//图片数组
      })
  
    },
    
        //自定义方法
        getParamIpt: function (e) {
          let value = app.updParam(e).expressage
          console.log('value')
          console.log(value)
          let oldpwd = value.replace(/[\W]/g,'');
          console.log(value)
          
          oldpwd = oldpwd.replace(/_/g,'');
          
          console.log(oldpwd)
          let param={
            expressage:oldpwd
          }
          this.setData(param)
        },


    delImage:function(e){
      let that  =this
      console.log('delImage')
      console.log(e.currentTarget.dataset.index)
      // wx.showModal({
      // title: '提示',
      // content: '确定要删除该附件吗？',
      // success: function (sm) {
      //   if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            that.data.imageList.splice(e.currentTarget.dataset.index,1) 
            console.log(that.data.imageList,"图片")
            that.setData({
              imageList: that.data.imageList 
            })
          // } else if (sm.cancel) {
          //   console.log('用户点击取消')
          // }
        // }
      // })
  
  
    },
})