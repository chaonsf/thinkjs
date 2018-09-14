const Base = require('./base.js');
const common=require('../self/common');
const fs=require("fs");
const xmlpeizhi=require('../self/peizhi');
const tojson=require('../self/tojson');
const toxml=require('../self/toXml');
const path=require('path');
const jsonPeizhi=require('../self/json');

module.exports = class extends Base {
    async downloadAction(){
        if(this.isPost){
            let arr=await common.download('./ftp_test');
            console.log(arr)
            common.dirlist=arr;
            this.json([{msg:"下载成功"}])
        }
    }
    async tojsonAction(){
        if(this.isPost){
            let arr;
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
            }
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
                let localPath=think.ROOT_PATH+"/www/download/"+arr[i];
                let time=common.time()
                let remotePath='./ftp_test/newAdd/'+name+"_backup_"+time+".xml"
                  let dd=await common.upload(localPath,remotePath)
                  let deleteFile=await common.deleteFile('./ftp_test/'+arr[i])
            }
            this.json([{msg:'移动文件成功'}])
        }
    }
};