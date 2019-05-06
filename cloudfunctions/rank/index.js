// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment');

cloud.init()
const db = cloud.database();
const _ = db.command;
var last_monday;
var last_sunday;
var date;
// 云函数入口函数
exports.main = async(event, context) => {
  date = new Date(new Date().getTime() + 28800000);
  const wxContext = cloud.getWXContext()
  if (event.type == "周排名") {
    console.log(date);
    getWeekTime();
    console.log(event.type);
    var lastMondayDate = new Date(last_monday);
    console.log(lastMondayDate);
    let res = await db.collection("signHistory").where({
      signTime: _.gt(lastMondayDate).and(_.lt(date))
    }).get().then(res => {
      console.log(res);
      console.log("success");
      return res;
    }).catch(err => {
      console.log('Error:', err);
      console.log('111111111111111111111111');
      return err;
    });

    console.log(res);
    return res;
    console.log("complete");
  }
}

function getWeekTime() {
  var weekOfDay = moment(date).format('E');
  last_monday = moment(date).subtract(weekOfDay - 1, 'days').format('YYYY/MM/DD'); //周一日期
  last_sunday = moment(date).add(7 - weekOfDay, 'days').format('YYYY/MM/DD'); //周日日期
  console.log(last_monday);
  console.log(last_sunday);
}