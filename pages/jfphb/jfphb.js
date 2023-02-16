Page({
  data: {},
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.tempData();
  },
  //测试临时数据
  tempData: function() {
    var list = [{
        rank: "1",
        txtStyle: "",
        icon: "/images/my.png",
        name: "李飞",
        pace: "23456",
      },
      {
        rank: "2",
        txtStyle: "",
        icon: "/images/my.png",
        name: "张叶",
        pace: "23450",
      },
      {
        rank: "3",
        txtStyle: "",
        icon: "/images/my.png",
        name: "王小婷",
        pace: "22345",
      },
      {
        rank: "4",
        txtStyle: "",
        icon: "/images/my.png",
        name: "袁经理",
        pace: "21687",
      },
      {
        rank: "5",
        txtStyle: "",
        icon: "/images/my.png",
        name: "陈雅婷",
        pace: "21680",
      },
      {
        rank: "6",
        txtStyle: "",
        icon: "/images/my.png",
        name: "许安琪",
        pace: "20890",
      },
      {
        rank: "7",
        txtStyle: "",
        icon: "/images/my.png",
        name: "里俊飞",
        pace: "20741",
      },
      {
        rank: "8",
        txtStyle: "",
        icon: "/images/my.png",
        name: "李小俊",
        pace: "19511",
      },
      {
        rank: "9",
        txtStyle: "",
        icon: "/images/my.png",
        name: "陈俊飞",
        pace: "19501",
      },
    ]

    this.setData({
      list: list
    });
  }
})