const Base = require('./base.js');
const common=require('../self/common');
const fs=require("fs");
const xmlpeizhi=require('../self/peizhi');
const tojson=require('../self/tojson');
const toxml=require('../self/toXml');
const path=require('path');
const jsonPeizhi=require('../self/toxmlPeizhi');

module.exports = class extends Base {
    async downloadAction(){
        if(this.isPost){
           let obj=await common.start('./ftp_test');
            this.json(obj)
        }
    }
    async tojsonAction(){
        if(this.isPost){
           /*  let arr;
            if(common.dirlist){
                arr=common.dirlist
            }else{
                arr=await common.catalog('./ftp_test');
            }
            let xml=xmlpeizhi.data;
            let toJson=new tojson(xml);
            console.log(think.ROOT_PATH);
            console.log(__dirname)
            for(let i=0;i<arr.length;i++){
                let name=arr[i];
                let data=await common.readFile("/www/download/"+name);
                let postData=toJson.invoke(data);
                console.log(postData)
                console.log(postData[0]);
                console.log(postData[1])
                console.log(postData[2])
            } */
            let json=await think.readXml('/www/static/ceshi.json');
            let shuju=JSON.parse(json);
            let peizhi=jsonPeizhi.data;
            let Toxml=new toxml(peizhi);
           let a= Toxml.start(shuju);
            this.json([{msg:"转译成功"}])
        }
    }
    async newdirAction(){
         if(this.isPost){
             let newdir=await common.makedir('./ftp_test','newAdd');
              if(newdir){
                  this.json([{msg:"新建文件夹成功"}])
              }
         }
    }
    async uploadAction(){
        if(this.isPost){
            let arr=common.dirlist?common.dirlist:await common.catalog('./ftp_test');
            for(let i=0;i<arr.length;i++){
                let name=path.basename(arr[i],'.xml')
                let time=common.time()
                let remotePath='./ftp_test/newAdd/'+name+"_backup_"+time+".xml"
                let aa=await common.yidong('./ftp_test/'+arr[i],remotePath)
            }

            this.json([{msg:'移动文件成功'}])
        }
    }
};