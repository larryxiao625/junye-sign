// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment');

cloud.init()
const db = cloud.database();
const _ = db.command;
var last_monday;
var last_sunday;
var date;
var start;
var end;
var rank = new Array();
// 云函数入口函数
exports.main = async(event, context) => {
  date = new Date(new Date().getTime() + 28800000);
  const wxContext = cloud.getWXContext()
  if (event.type == "周排名") {
    getWeekTime();
    var lastMondayDate = new Date(last_monday);
    let res = await db.collection("signHistory").where({
      signTime: _.gt(lastMondayDate).and(_.lt(date))
    }).orderBy('signStudentId','asc').get().then(res => {
      console.log(res);
      console.log("success");
      rankThePeople(res);
      console.log(rank);
    }).catch(err => {
      console.log('Error:', err);
      console.log('111111111111111111111111');
      return err;
    });
    return rank;
  }
  if (event.type == "月排名") {
    console.log(date);
    console.log(event.type);
    getMonth();
    var lastMondayDate = new Date(start);
    console.log(lastMondayDate);
    let res = await db.collection("signHistory").where({
      signTime: _.gt(lastMondayDate).and(_.lt(date))
    }).orderBy('signStudentId', 'asc').get().then(res => {
      console.log(res);
      console.log("success");
      rankThePeople(res);
      console.log(rank);
    }).catch(err => {
      console.log('Error:', err);
      return err;
    });
  }
  return rank;
}

function getWeekTime() {
  var weekOfDay = moment(date).format('E');
  last_monday = moment(date).subtract(weekOfDay - 1, 'days').format('YYYY/MM/DD'); //周一日期
  last_sunday = moment(date).add(7 - weekOfDay, 'days').format('YYYY/MM/DD'); //周日日期
}

function getMonth(){
  start = moment(date).month(moment().month() - 1).startOf('month').format("YYYY/MM/DD");
}

function rankThePeople(res){
  console.log("gogogo");
  console.log(res.data.length);
  var count=0;
  var id;
  var number=0;
  for(var i=0;i<res.data.length;i++){
    console.log(res.data[i].signStudentId);
    if(i===0){
      id=res.data[i].signStudentId;
      count++;
      continue;
    }
    if(res.data[i].signStudentId!=id){
      var json={
        "stuId": res.data[i].signStudentId,
        "count": count
      }
      rank.push(json);
      console.log(rank);
      count=1;
      number++;
      continue;
    }
    if(i==res.data.length-1){
      count++;
      var json = {
        "stuId": res.data[i].signStudentId,
        "count": count
      }
      rank.push(json);
      console.log(rank);
      break;
    }
    count++;
  }
}