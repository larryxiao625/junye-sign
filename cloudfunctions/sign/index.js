// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db=cloud.database();
const _=db.command;
const date=new Date();
// 云函数入口函数
exports.main = async (event, context) => {
  const studentInfo= cloud.getWXContext();
  console.log(event.activityId);
  var activity;
  db.collection("activity").doc(event.activityId).get().then(res => {
    activity=res.data[0];
    console.log(res.data[0]);
    if (activity.beginTime < date && activity.endTime > date) {
      db.collection('signHistory').add({
        data: {
          signTime: date,
          signActivityId: activity._id,
          signStudentId: studentInfo.OPENID
        }
      }).then(function (res) {
        console.log(res);
        return {
          isScuess: true,
          id: res
        };
      }).catch(function (res) {
        console.log(res);
      })
    } else {
      return {
        isScuess: false
      }
    }
  }).catch(console.error)
}