const Base = require('./base.js');
const toxml=require('../self/toxmlInvolving');
const tojsonTask=require("../self/toJsonTask");
const queryMail=require("../self/util")
const mailConfig=require('../self/mailConfig')
const cache=require('memory-cache')
const mailcall=require('../self/mailCall')
const log=require('../self/log')
module.exports = class extends Base {
    async downloadAction(){
        if(this.isPost){
           let obj=await tojsonTask.ftpStart('./ftp_test',"/www/download/",'_bacup_');
            this.json(obj)
        }
    }
    async tojsonAction(){
        if(this.isPost){
              let xml=toxml.start('/www/static/ceshi.json');
            this.json([{msg:"json转xml转译成功"}])
        }
    }
    async mailAction(){
        if(this.isPost){
            let arr=await mailcall.start()
           /*  let config=new queryMail(mailConfig.config);
           // let time='2018-08-06 12:00';
            let myDate=new Date();
            let day=myDate.toLocaleDateString();
           console.log(day)
           let data=await config.start(day);
           let buffer=cache.get(day)
           let arr=[];
           if(buffer){
              let i=buffer.length;
               for(let j=i;j<data.length;j++){
                arr.push(data[j])
               }
               cache.put(day,data) 
           }else{
             cache.put(day,data) 
             arr=data
           } */
          console.log(arr)
            this.json({msg:"hhjh"})
        }
    }
   
   
};