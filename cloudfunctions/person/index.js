// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _=db.command;
var stuInfo={
  name: "姓名",
  stuId: "学号"
}
var isScuess=false
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event.stuName);
  console.log(event.stuId);
  let person = await db.collection('student').where({
    stuOpenId: wxContext.OPENID
  }).update({
    data:{
      stuName: event.stuName,
      stuId: event.stuId
    }
  }).then(res=>{
    isScuess=true;
  }).catch();
  console.log(isScuess);
  if(isScuess){
    return "scuess";
  }else {
    return "false";
  }
}