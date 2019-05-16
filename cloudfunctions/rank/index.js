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
  var tempRank;
  if (event.type == "周排名") {
    getWeekTime();
    var lastMondayDate = new Date(last_monday);
    let res = await db.collection("signHistory").where({
      signTime: _.gt(lastMondayDate).and(_.lt(date))
    }).orderBy('signStudentId','asc').get();
    console.log(res);
    return rankThePeople(res);
  }
  if (event.type == "月排名") {
    console.log(date);
    console.log(event.type);
    getMonth();
    var lastMondayDate = new Date(start);
    console.log(lastMondayDate);
    let res = await db.collection("signHistory").where({
      signTime: _.gt(lastMondayDate).and(_.lt(date))
    }).orderBy('signStudentId', 'asc').get();
    console.log(res);
    return rankThePeople(res);
  }
}

function getWeekTime() {
  var weekOfDay = moment(date).format('E');
  last_monday = moment(date).subtract(weekOfDay - 1, 'days').format('YYYY/MM/DD'); //周一日期
  last_sunday = moment(date).add(7 - weekOfDay, 'days').format('YYYY/MM/DD'); //周日日期
}

function getMonth(){
  start = moment(date).month(moment().month() - 1).startOf('month').format("YYYY/MM/DD");
}

async function rankThePeople(res){
  console.log("gogogo");
  console.log(res.data.length);
  var count=0;
  var id;
  var number=0;
  var name;
  for(var i=0;i<res.data.length;i++){
    console.log(res.data[i].signStudentId);
    console.log(i);
    if(i===0){
      try{
        let tempName = await db.collection('student').where({
          stuOpenId: res.data[i].signStudentId
        }).get();
        name = tempName.data[0].stuName;
      }catch(err){
        console.log(err);
      }
      console.log(name);
      console.log("i==0");
      id=res.data[i].signStudentId;
      count++;
      continue;
    }
    if(res.data[i].signStudentId!=id){
      try{
        let tempName = await db.collection('student').where({
          stuOpenId: res.data[i].signStudentId
        }).get();
        name=tempName.data[0].stuName;
      }catch(err){
        console.log(err);
      }
      console.log(name);
      console.log("!");
      var json={
        "stuId": name,
        "count": count
      }
      rank.push(json);
      console.log(rank);
      count=1;
      number++;
      continue;
    }
    if(i==res.data.length-1){
      console.log("last");
      count++;
      var json = {
        "stuId": name,
        "count": count
      }
      rank.push(json);
      console.log(rank);
      break;
    }
    count++;
  }
  return rank;
}