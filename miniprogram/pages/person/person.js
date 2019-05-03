const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var personThis=this;
    if(this.data.canIUse){
      wx.getSetting({
        success(res){
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success(res){
                personThis.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                })
              }
            })
          }
        }
      })
    }
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

  onGetUserInfo:function(){
    var getUserInfoThis=this;
    wx.getSetting({
      success(res){
        if(!res.authSetting['scope.userInfo'] || !getUserInfoThis.hasUserInfo){
          wx.authorize({
            scope: 'scope.userInfo',
            success(){
              wx.getUserInfo({
                success(res){
                  getUserInfoThis.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                  })
                }
              })
            }
          })
        }
      }
    })
  }
})