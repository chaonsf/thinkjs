const Base = require('./base.js');
const toxml=require('../self/toxmlInvolving');
const tojsonTask=require("../self/toJsonTask");
const queryMail=require("../self/util")
const mailConfig=require('../self/mailConfig')
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
            let config=new queryMail(mailConfig.config);
            let time='2018-09-26 12:00';
          
            console.log(time)
           let data=await config.start(time)
           console.log("result:",data)
            this.json({msg:"hhjh"})
        }
    }
   
   
};