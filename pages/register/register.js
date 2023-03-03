//index.js
const app = getApp()

var ctx;
var fontSize = 24 //字体大小
var fontFamily = "SimHei" //字体
var code = null //验证码文本

Page({

    /**
     * 页面的初始数据
     */
    data: {
    
       //验证码属性
        text: '',
        count: 4,
        width: 100,
        height: 50,
        current:1,
        codeText:'',
        counting:false,
        phone:'',//账号
        yzm:'',//验证码
        mima:'',//密码
        yzmima:'',//验证密码
        dlphone:'',//登录的手机号
        dlmima:'',//登录的密码
    },
    // 登陆注册监听
    click(e){
      let index = e.currentTarget.dataset.code;
      this.setData({
        current:index
      })
    },
    //获取验证码 
    getCode(){
      var that = this;
      if (!that.data.counting) {
        wx.showToast({
          title: '验证码已发送',
        })
        //开始倒计时60秒
        that.countDown(that, 60);
      } 
    },
    //倒计时60秒
    countDown(that,count){
      if (count == 0) {
        that.setData({
          codeText: '获取验证码',
          counting:false
        })
        return;
      }
      that.setData({
        counting:true,
        codeText: count + '秒后重新获取',
      })
      setTimeout(function(){
        count--;
        that.countDown(that, count);
      }, 1000);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.crash()

    },
    crash() {
        this.drawPic(this)
      },
      /**绘制验证码图片**/
  drawPic(that) {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        //清除画布
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, 91, 36)
        /**绘制背景色**/
        ctx.fillStyle = that.randomColor(180, 240); //颜色若太深可能导致看不清
        ctx.fillRect(0, 0, that.data.width, that.data.height)
        /**绘制文字**/
        var arr;
        var text = '';
        var str = 'ABCEFGHJKLMNPQRSTWXY123456789';
        var code_temp = "";
        for (var i = 0; i < that.data.count; i++) {
          var txt = str[that.randomNum(0, str.length)];
          code_temp += txt;
          ctx.fillStyle = that.randomColor(50, 160); //随机生成字体颜色
          ctx.font = that.randomNum(fontSize, fontSize + 6) + 'px ' + fontFamily; //随机生成字体大小
          var x = 10 + i * 20;
          var y = that.randomNum(25, 30);
          var deg = that.randomNum(-30, 30);
          //修改坐标原点和旋转角度
          ctx.translate(x, y);
          ctx.rotate(deg * Math.PI / 180);
          ctx.fillText(txt, 5, 0);
          text = text + txt;
          //恢复坐标原点和旋转角度
          ctx.rotate(-deg * Math.PI / 180);
          ctx.translate(-x, -y);
        }
        code = code_temp;
        /**绘制干扰线**/
        for (var i = 0; i < 4; i++) {
          ctx.strokeStyle = that.randomColor(40, 180);
          ctx.beginPath();
          ctx.moveTo(that.randomNum(0, that.data.width), that.randomNum(0, that.data.height));
          ctx.lineTo(that.randomNum(0, that.data.width), that.randomNum(0, that.data.height));
          ctx.stroke();
        }
        /**绘制干扰点**/
        for (var i = 0; i < 20; i++) {
          ctx.fillStyle = that.randomColor(0, 255);
          ctx.beginPath();
          ctx.arc(that.randomNum(0, that.data.width), that.randomNum(0, that.data.height), 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      })
  },
  randomNum: function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  /**生成一个随机色**/
  randomColor: function (min, max) {
    var that = this
    var r = that.randomNum(min, max);
    var g = that.randomNum(min, max);
    var b = that.randomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
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
  // 登录与注册的方法
  zhuce(){
    var that = this;
    //注册
    if(this.data.current == '0'){
      if (that.data.phone === '' || that.data.phone === null || that.data.phone === undefined) {
        this.opact("账号不能为空！");
        return
      }
//       if (that.data.phone.length !== 11) {
//         this.opact("请输入正确的手机号！");
//         return
//       }
      if (that.data.mima=== '' || that.data.mima=== null || that.data.mima=== undefined) {
        this.opact("密码不能为空！");
        return
      }
      if (that.data.yzmima=== '' || that.data.yzmima=== null || that.data.yzmima=== undefined) {
        this.opact("确认密码不能为空！");
        return
      }
      if(that.data.mima !== that.data.yzmima){
        this.opact("两次输入的密码不一致，请重新输入！");
        return
      }
      if(this.data.yzm !== code){
        this.opact("验证码不正确，区分大小写！");
        return
      }
      wx.request({
          url: app.globalData.webroot + '/xcx/my/zhuce',
          data: {
            phone: that.data.phone,
            mima: that.data.mima,
          },
          method: 'post',
          header: {
            'content-type': 'application/json;charset=UTF-8',
          },
          success: function (res) {
            if(res.data.data.return == "true"){
              that.setData({
                "phone":"",
                "yzm":"",
                "mima":"",
                "yzmima":"",
                "current":"1"
              })
              that.opact("注册成功！");
            }else{
              that.opact("账号已存在，请重新输入！");
            }
           
            
            
          },
          fail: function () {
             this.opact("操作失败，请稍后再试");
          }
      })
    }else{//登录
      if (that.data.dlphone === '' || that.data.dlphone === null || that.data.dlphone === undefined) {
        this.opact("账号不能为空！");
        return
      }
      if (that.data.dlmima=== '' || that.data.dlmima=== null || that.data.dlmima=== undefined) {
        this.opact("密码不能为空！");
        return
      }
      wx.request({
        url: app.globalData.webroot + '/xcx/my/denglu',
        data: {
          phone: that.data.dlphone,
          mima: that.data.dlmima,
        },
        method: 'post',
        header: {
          'content-type': 'application/json;charset=UTF-8',
        },
        success: function (res) {
          if(res.data.data.return == "true"){
            that.setData({
              "dlphone":"",
              "dlmima":"",  
            })
            that.opact("登录成功！");
            wx.setStorageSync("userInfo", res.data.data.userinfo);
            console.log("userinfo res",res)
            //跳转到首页
            wx.redirectTo({
              url: '/pages/main/main'
            })
          }else if(res.data.data.return == "yhmbzc"){
            that.opact("账号错误，请重新输入！");
          }else if(res.data.data.return == "mmcw"){
            that.opact("密码错误，请重新输入！");
          }else{
            that.opact("未知错误，请联系管理员！");
          }
          
        },
        fail: function () {
           this.opact("操作失败，请稍后再试");
        }
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
  
    }
  })
  