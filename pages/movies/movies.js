var app = getApp();
var util = require("../../utils/util.js");
Page({
  //请求豆瓣的数据
  data: {
    movies: {},
    intheaters: {},
    comingSoon: [],
    top250: {},
    searchResult: {},
    totalCount: 0,
    isEmpty: true,
    containerShow: true,
    searchPannelShow: false
  },
  onLoad: function () {
    var intheatersUrl = app.globalData.doubanBase +
      '/v2/movie/in_theaters?start=0&count=3';
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon?start=0&count=3';
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250?start=0&count=3';
    this.getMoiveListData(intheatersUrl, "intheaters", "正在热映");
    this.getMoiveListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMoiveListData(top250Url, "top250", "豆瓣Top250");
  },
  getMoiveListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-type': ' ' // 这里写json也可以
      },
      success: function (res) {
        that.proccessDoubanData(res.data, settedKey, categoryTitle);
      }
    })
  },
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPannelShow: false
    })
  },
  onBindChange: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.data.searchUrl = searchUrl;
    this.getMoiveListData(searchUrl, "searchResult", '');

  },
  onScrollLower: function (event) {
    var nextUrl = this.data.searchUrl+"?start="+this.data.totalCount+"&count=20";
    this.getMoiveListData(nextUrl, "searchResult", '');
  },
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },
  proccessDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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
    var totalMovies ={};
    var readyData = {};
   
    
    readyData[settedKey] = {
      movies:movies,
      categoryTitle: categoryTitle
    };
     this.setData(readyData)
     this.data.totalCount+=20;
    
  }
})