const db=wx.cloud.database();
const _=db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSign: false,
    hasActivity: false,
    nowActivity: {},
    afterActivityName: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var signThis=this;
    var date=new Date();
    console.log(date);
    db.collection("activity").where(_.and([
      {
        beginTime: _.lt(date)
      },
      {
        endTime: _.gt(date)
      }
    ])
    ).get({
      success: res=>{
        console.log(res.data[0]);
        signThis.setData({
          nowActivity: res.data[0],
          hasActivity: true
        });
      }
    })
    db.collection("activity").where({
      beginTime: _.gt(date)
    }).get({
      success: res=>{
        if(res.data.length>0){
          var tempActivityName={};
          for(var i=0;i<res.data.length;i++){
            tempActivityName[i]=res.data[i].name;
          }
          signThis.setData({
            afterActivityName: tempActivityName
          });
        }
      }
    })
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
  sign:function(){
    var signThis=this;
    console.log(signThis.data.nowActivity._id);
    wx.getSetting({
      success(res){
        if(res.authSetting["scope.userLocation"]){
          signCloudFunction(signThis);
        }else{
          wx.authorize({
            scope: 'scope.userLocation',
            success(){
              signCloudFunction(signThis);
            },
            fail(){
              wx.showToast({
                title: '请授权权限以签到',
              })
            }
          })
        }
      }
    })
  },
})
function signCloudFunction(signThis) {
  if (signThis.data.hasActivity) {
    wx.getLocation({
      success: function (res) {
        wx.cloud.callFunction({
          name: 'sign',
          data: {
            activityId: signThis.data.nowActivity._id,
            longitude: res.longitude,
            latitude: res.latitude
          }
        }).then(res => {
          console.log(res);
          if(res.result.isSign){
            signThis.setData({
              isSign: true
            })
          }else{
            signThis.setData({
              isSign: false
            })
          }
          wx.showToast({
            title: res.result.toastTitle,
          })
        }).catch(console.error)
      },
    })
  };
}