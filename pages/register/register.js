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
        console.log(code)
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
  