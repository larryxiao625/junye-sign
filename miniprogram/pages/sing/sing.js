var util=require("../util/util.js");
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
    afterActivity: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var signThis = this;
    var date = new Date();
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
      success: res => {
        console.log(res.data[0]);
        if(res.data[0]===undefined){
          signThis.setData({
            hasActivity:false
          })
        }else{
          signThis.setData({
            nowActivity: res.data[0],
            hasActivity: true
          });
        }
      }
    })
    db.collection("activity").where({
      beginTime: _.gt(date)
    }).get({
      success: res => {
        console.log(res.data);
        console.log(res.data.length);
        if (res.data.length > 0) {
          console.log(res.data.length)
          signThis.data.afterActivity = [];
          for (var i = 0; i < res.data.length; i++) {
            console.log(util.formatTime(res.data[i].beginTime))
            console.log(res.data[i].name);
            signThis.data.afterActivity[i] = {
              activityName: res.data[i].name,
              beginTime: util.formatTime(res.data[i].beginTime)
            }
          }
          console.log(signThis.data.afterActivity);
          signThis.setData({
            afterActivity: signThis.data.afterActivity
          })
        }
      }
    })
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
        if(!res.authSetting["scope.userInfo"]){
          wx.authorize({
            scope: 'scope.userInfo',
            success(){
              if(!res.authSetting["scope.userLocation"]){
                wx.authorize({
                  scope: 'scope.userLocation',
                  success() {
                    if(!res.authSetting["scope.userLocation"]){
                      wx.authorize({
                        scope: 'scope.userLocation',
                        success(){
                          signCloudFunction(signThis);
                        }
                      })
                    }else{
                      signCloudFunction(signThis);
                    }
                  },
                  fail() {
                    wx.showToast({
                      title: '请授权权限以签到',
                    })
                  }
                })
              }
            },
            fail(){
              wx.showToast({
                title: '请授予权限',
              })
            }
          })
        }else if(res.authSetting["scope.userLocation"]){
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
      type: "gcj02",
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
          if(res.result.toastTitle=="签到成功"){
            wx.showToast({
              title: res.result.toastTitle,
            })
          }else{
            wx.showToast({
              title: res.result.toastTitle,
              image: "../../images/warn.png"
            })
          }
        }).catch(console.error)
      },
    })
  };
}