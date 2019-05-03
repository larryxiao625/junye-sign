//app.js
App({
  onLaunch: function () {
    this.globalData = {}
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'junye-sign-0bhda',
        traceUser: true,
      })
      wx.cloud.callFunction(
        {
          name : "login",
          data : {},
          success: res=>{
            console.log("login调用成功" +res.result.openid),
            this.globalData.openid=res.result.openid
          }
        }
      )
    }
  }
})
