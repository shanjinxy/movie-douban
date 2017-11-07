var postsData = require("../../data/post-data.js")
// 这里只能用相对路径 绝对路径会报错
Page({
  data: {
    //小程序总会会读取data对象来做数据绑定，这个动作称为a
    // 而这个动作a的执行，是在onload事件执行之后发生的
    posts_key:[]
  },
  onLoad: function (options) {
    //页面初始化，OPtions为页面跳转所带来的参数
    // 生命周期函数--监听页面加载
    
    this.setData({
      posts_key: postsData.postList
    });
    console.log(this.data.posts_key[0])
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    // console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  onSwiperTap: function (event) {
    // target和currentTarget区别
    // target是指当前点击的组件，currentTarget指的是事件捕获的组件
    var postId = event.target.dataset.postid;
    console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})