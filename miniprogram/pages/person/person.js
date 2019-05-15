const app = getApp()
const db=wx.cloud.database();
const _=db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userInfo:{},
    name: "姓名",
    stuId: "学号"
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
    getUser(this);
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
                getUser(getUserInfoThis);
                }
              })
            }
          })
        }
      }
    });
  },

  formSubmit:function(e){
    var formSubmitThis=this;
    console.log(e.detail.value.name);
    console.log(e.detail.value.stuId);
    console.log(this.data.name);
   if(e.detail.value.name=='' || e.detail.value.stuId==''){
     wx.showToast({
       title: '资料不允许为空',
       image: "../../images/warn.png",
     })
   }else if(this.data.name=="姓名"){
     console.log("update")
    db.collection('student').add({
       data:{
         stuName: e.detail.value.name,
         stuId: e.detail.value.stuId,
         stuOpenId: app.globalData.openid
       }
     }).then(res=>{
       formSubmitThis.setData({
         name: e.detail.value.name,
         stuId: e.detail.value.stuId,
       })
       wx.showToast({
         title: '更新成功',
       })
     }).catch();
   }else{
     wx.cloud.callFunction({
       name: 'person',
       data:{
         stuName: e.detail.value.name,
         stuId: e.detail.value.stuId
       }
     }).then(res=>{
      if(res.result=="scuess"){
        console.log("scuess");
        formSubmitThis.setData({
          name: e.detail.value.name,
          stuId: e.detail.value.stuId,
        })
        wx.showToast({
          title: '更新成功',
        })
      }else{
        wx.showToast({
          title: '更新失败,请重试',
          image: "../../images/warn.png",
        })
      }
     }).catch();
   }
  }
})

function getUser(tempThis){
  db.collection('student').where({
    stuOpenId: app.globalData.data
  }).get().then(res=>{
    if(res.data.length==0){

    }else{
      tempThis.setData({
        name: res.data[0].stuName,
        stuId: res.data[0].stuId
      })
    }
  }).catch();
}