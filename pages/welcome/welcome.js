
Page({
    onTap:function (){
        wx.switchTab({
          url: '../posts/post',
          success: function(res){
            // success
            console.log("redirectTo")
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        })
    }
})