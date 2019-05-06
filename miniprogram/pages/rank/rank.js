Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCount:[{
      "title": "周排名",
      "rank": [],
      "color": "#000000",
      "isSlected" : true
    },{
      "title": "月排名",
      "rank": [],
      "color": "#BFBFBF",
      "isSlected": false
    }]
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
    if(this.data.tabCount[0].isSlected){
      rank("周排名",this);
    }else{
      rank("月排名",this);
    }
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
  navToPage:function(event){
    var rankThis=this;
    console.log(event);
    if(event.currentTarget.id=="周排名"){
      console.log("周排名");
      rank("周排名",rankThis);
      this.setData({
        'tabCount[0].color': '#000000',
        'tabCount[1].color': '#BFBFBF',
        'tabCount[0].isSlected': true,
        'tabCount[1].isSlected': false
      })
    } else if (event.currentTarget.id=="月排名"){
      console.log("月排名");
      rank("月排名",rankThis);
      this.setData({
        'tabCount[0].color': '#BFBFBF',
        'tabCount[1].color': '#000000',
        'tabCount[1].isSlected': true,
        'tabCount[0].isSlected': false
      })
    }
  }
})
function rank(type,rankThis){
  if(type=="周排名"){
    wx.cloud.callFunction({
      name: 'rank',
      data:{
        type: type
      },
      complete: res=>{
        console.log(res);
        rankThis.setData({
          'rankThis.data.tabCount[0].rank': res
        })
      },
    })
  }else if(type=="月排名"){
    wx.cloud.callFunction({
      name: 'rank',
      data: {
        type: type
      },
      complete: res => {
        rankThis.setData({
          'rankThis.data.tabCount[1].rank': res
        })
      },
    })
  }
}