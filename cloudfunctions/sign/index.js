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
      console.log("冲冲冲")
      console.log(date);
      db.collection('signHistory').add({
        data: {
          signTime: date,
          signActivityId: activity._id,
          signStudentId: OPENID
        }
      }).then(function(res) {
        console.log(res)
        resolve("success")
      }).catch(console.error)
    } else {
      reject("no");
    }
  }).catch(console.error)
}).then(res => {
  return true
}).catch(res => {
  return false
})