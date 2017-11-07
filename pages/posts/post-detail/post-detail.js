// 这里只能用相对路径，用绝对路径的话会报错
var postsData = require("../../../data/post-data.js");
var app = getApp();
Page({
  data: {
    isPlayingMusic:false
  },
  onLoad: function (option) {
    var postId = option.id;
    this.data.currentPostId = postId;
    // console.log(postsData.postList); 这是一个数组
    var postData = postsData.postList[postId];
    // console.log(postData); //这是一个对象
    // 数据绑定
    this.setData({
      postData: postData
    })
    // 初始化图片样式的代码
    var postsCollected = wx.getStorageSync("posts_collected");
    if (postsCollected) {
      var postCollected = postsCollected[postId]

      // 绑定collected这个变量
      this.setData({
        collected: postCollected
      })
      // 通过this.data.变量名可以获取这个变量的值
 
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected);
    }
    if (app.globalData.g_isMusicPlaying && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic:true
      })
    }
    this.setMusicMonitor();
  },
  setMusicMonitor:function (){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isMusicPlaying = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isMusicPlaying = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },
  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync(
      "posts_collected"
    );
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // 调用 当前的函数 必须加this
    // this.showModal(postsCollected, postCollected);
    this.showToast(postsCollected, postCollected)
  },

  showModal: function (postsCollected,postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      // 提示的内容
      content: postCollected?'收藏该文章？':'取消收藏该文章？',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      // 确认文本
      confirmText: '确定',
      // 确认文本的颜色
      confirmColor: '#405f80',
      // 注意 这里success的话 this就是不当前的 page啦
      success:function (res){
        // console.log(this);
        // res.confirm 为true的话证明 用户选择了确认这个选项
        if(res.confirm){
          wx.setStorageSync('posts_collected', postsCollected);
          // that.showToast();
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  showToast: function (postsCollected, postCollected) {
    // console.log(this);
    // 需要将变量传进来 不然这个函数找不到这个两个变量
    // 更新缓存
    wx.setStorageSync('posts_collected', postsCollected);
  // 切换数据视图
    this.setData({
      collected: postCollected
    })
    // showToast 是不需要有用户确认的
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      // 图标设定
      icon: "success",
      // 持续时间
      duration: 1000,
    })
  },
  onShareTap:function (event){
    var itemList = ['分享给微信好友', '分享到朋友圈', '分享到QQ', '分享到微博'];
    wx.showActionSheet({
      itemList:itemList,
      itemColor: "#405f80",
      success:function (res){
          // res.cancel 用户是不是点击了取消按钮
          // res.tapIndex 数组元素的序号，从0开始
          wx.showModal({
            title: '用户'+itemList[res.tapIndex],
            content: '用户是否取消？'+res.cancel+'现在无法实现分享功能',
            showCancel: true,
            cancelText: '',
            cancelColor: '',
            confirmText: '',
            confirmColor: '',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
      }
    })
  },
  onMusicTap:function (event){
      var currentPostId = this.data.currentPostId;
      var postData = postsData.postList[currentPostId];
      var isPlayingMusic = this.data.isPlayingMusic;
      if(isPlayingMusic){
        wx.pauseBackgroundAudio();
        this.setData({
          isPlayingMusic:false
        })
      }else{
          wx.playBackgroundAudio({
            dataUrl: postData.music.url,
            title: postData.music.title,
            coverImgUrl: postData.music.coverImg
          })
          this.setData({
            isPlayingMusic:true
          })
      }
  }

})