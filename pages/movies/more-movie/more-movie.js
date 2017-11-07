// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({
  data:{
    movies:{},
    navigateTitle:"",
    requestUrl:'',
    totalCount:0,
    isEmpty:true,
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = '';
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl,this.proccessDoubanData);
  },
  onScrollLower:function (event){
    var nextUrl = this.data.requestUrl+"?start="
    +this.data.totalCount+"&count=20";
    util.http(nextUrl,this.proccessDoubanData)
    wx.showNavigationBarLoading();
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
  proccessDoubanData: function (moviesDouban) {
    var movies = [];
    // 遍历回来的subjects
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...';
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id  
      }
      movies.push(temp);
    }
    var totalMovies = {};
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies)
    }else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies:totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {
   wx.setNavigationBarTitle({
     title: this.data.navigateTitle ,
   })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉刷新数据
    // 有scroll-view 无法下拉刷新
    var refreshUrl = this.data.requestUrl = "?start=0&count=20";
    util.http(refreshUrl,this.proccessDoubanData);
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})