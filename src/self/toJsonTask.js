const ftp=require("./ftp");
const  toJsonPeiZhi=require('./peizhi'); //json的配置文件
const path=require('path');
const toJson=require("./tojson");
const ftpConfig=require("./ftpConfig")  //ftp的配置文件

module.exports={
    async ftpStart(dir,download,midName){
        let ftpWork=new ftp(ftpConfig.config)//传入配置文件
        let arr=await ftpWork.download(dir);
        let time=ftpWork.time();
        let creatdir=await ftpWork.makedir(dir,time);
       if(creatdir){
         for(let i=0;i<arr.length;i++){
            let name=path.basename(arr[i],'.xml');
            await ftpWork.move(dir+"/"+arr[i],dir+'/'+time+"/"+name+midName+time+".xml")
         }
     }
     let xml=toJsonPeiZhi.data;
     let tojson=new toJson(xml);
     let obj=[]
     for(let i=0;i<arr.length;i++){
        let name=arr[i];
        let data=await ftpWork.readFile(download+name);
         let postData=tojson.invoke(data);
         obj.push(postData)
     }
     function result(){
         return new Promise((resolve,reject)=>{
                resolve(obj)
         })
     }
     let data=await result();
     return data
    }
}