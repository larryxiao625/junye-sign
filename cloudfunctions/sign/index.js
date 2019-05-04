// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
function isInArea(latitudePeople, longitudePeople, latitudeLocation, longitudeLocation) {
  console.log(latitudePeople+" "+longitudePeople);
  console.log(latitudeLocation+" "+longitudeLocation);
  var f = rad((latitudePeople + latitudeLocation) / 2);
  var g = rad((latitudePeople - latitudeLocation) / 2);
  var l = rad((longitudePeople - longitudeLocation) / 2);
  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);
  var s, c, w, r, d, h1, h2;
  var a = 6378137.0;//The Radius of eath in meter.
  var fl = 1 / 298.257;
  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;
  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;
  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;
  s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
  console.log(s);
  if(s>150){
    return false;
  }else{
     return true;
  }
}

function rad(d) {
  var PI=Math.PI;
  return d*PI/180.0;
}
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
      }).get().then(res => {
        console.log(res.data);
        if (res.data.length > 0) {
          resolve("已经签到");
        } else {
          if (isInArea(event.latitude, event.longitude, activity.coordinate.latitude, activity.coordinate.longitude)) {
            db.collection('signHistory').add({
              data: {
                signTime: date,
                signActivityId: activity._id,
                signStudentId: OPENID
              }
            }).then(function(res) {
              console.log(res);
              resolve("签到成功");
            }).catch(console.error)
          } else {
            reject("未到指定区域");
          }
        }
      }).catch(res => {
        console.log("queryError");
      })
    } else {
      reject("未到签到时间");
    }
  }).catch(res => {
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