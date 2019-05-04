// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject) => {
  var date = new Date()
  const {
    APPID,
    OPENID
  } = cloud.getWXContext()
  var activity
  db.collection("activity").doc(event.activityId).get().then(res => {
    activity = res.data;
    console.log(activity)
    console.log(date);
    if (activity.beginTime < date && activity.endTime > date) {
      console.log("冲冲冲");
      console.log(date);
      console.log("hello");
      console.log(event.activityId);
      console.log(OPENID);
      db.collection('signHistory').where({
        signActivityId: event.activityId,
        signStudentId: OPENID
      }).get().then(res=>{
        console.log(res.data);
        if (res.data.length > 0) {
          resolve("已经签到");
        } else {
          db.collection('signHistory').add({
            data: {
              signTime: date,
              signActivityId: activity._id,
              signStudentId: OPENID
            }
          }).then(function (res) {
            console.log(res);
            resolve("签到成功");
          }).catch(console.error)
        }
      }).catch(res=>{
        console.log("queryError");
      })
    } else {
      reject("未到签到时间");
    }
  }).catch(res=>{
    console.log("fail");
    reject("签到失败")
  })
}).then(res => {
  return {
    toastTitle: res,
    isSign: true
  }
}).catch(res => {
  return {
    toastTitle: res,
    isSign: false
  }
})