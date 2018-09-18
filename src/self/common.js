const fs=require('fs');
const ftp=require('ftp');
let client=new ftp();
let xmlpeizhi=require('./peizhi');
let toJson=require('./tojson');
let path=require('path');
let config=think.config('ftpConfig');
module.exports={
      async download(dir){
           let arr=[];
           let that=this;
           let num=0;
           function result(){
               return new Promise((resolve,reject)=>{
                   client.list(dir,(err,list)=>{
                       if(err) throw err;
                       console.log(list)
                       for(let t=0;t<list.length;t++){
                           if(list[t].type=="-"){
                                client.get(dir+"/"+list[t].name,(err,stream)=>{
                                   if(err) throw err;
                                   arr.push(list[t].name)
                                   stream.once('close',()=>{
                                    client.end()                                  
                                })
                                stream.pipe(fs.createWriteStream(think.ROOT_PATH+"/www/download/"+list[t].name))
                               })
                           }else{
                               ++num;
                           }  
                       }
                      let inter=setInterval(function(){
                          if(arr.length+num==list.length){
                              resolve(arr);
                              clearInterval(inter)
                          }
                      },1000)
                     
                   })
                   client.connect(config)
               })
           }
           let data=await result();
           return data
      },
      async catalog(dir){
        let arr=[];
        let that=this;
        function result(){
           return new Promise((resolve,reject)=>{
               client.list(dir,(err,list)=>{
                   if(err) throw err;
                   for(let t=0;t<list.length;t++){
                       if(list[t].type=='-'){
                           arr.push(list[t].name)
                       }
                   }
                   resolve(arr)
               })
               client.connect(config)
           })
        }
        let data=await result();
        return data
      },
      async makedir(dir,newName){
          let that=this;
          function result(){
              let boff=false
              return new Promise((resolve,reject)=>{
                  client.on("ready",()=>{
                      client.mkdir(dir+"/"+newName,(err)=>{
                          if(err) throw err;
                          console.log("创建文件夹成功");
                          boff=true
                          resolve(boff);
                      })
                  })
                  client.connect(config)
              })
          }
          let data=await result();
          return data
      },
      async upload(localPath,remotePath){
          let that=this;
          function result(){
              return new Promise((resolve,reject)=>{
                  client.on("ready",()=>{
                      client.put(localPath,remotePath,(err)=>{
                          if(err) throw err;
                          console.log("上传成功");
                          resolve(true);
                      })
                  })
                  client.connect(config)
              })
          }
          let data=await result();
          return data
      },
      async deleteFile(dir){
          let that=this;
           let boff=false
          function result(){
              return new Promise((resolve,reject)=>{
                  client.on("ready",()=>{
                      client.delete(dir,(err)=>{
                          if(err) throw err;
                          console.log("删除文件成功");
                          boff=true;
                         client.end()
                          resolve(boff)
                      })
                  })
                  client.connect(config)
              })
          }
          let data=await result()
          return data
      },
      time(){
          let date=new Date();
          let time=date.toLocaleDateString();
          let hours=date.getHours();
          let min=date.getMinutes();
          let sec=date.getSeconds();
          let whil=''+time+hours+min+sec;
          return whil
      },
      async readFile(url){
          function result(){
              return new Promise((resolve,reject)=>{
                  fs.readFile(think.ROOT_PATH+url,"utf-8",(err,data)=>{
                       if(err) throw err;
                       resolve(data)
                  })
              })
          }
          let data=await result();
          return data;
      },
      async yidong(oldpath,newpath){
          let that=this;
         function result(){
             return new Promise((resolve,reject)=>{
                 //client.on('ready',()=>{
                      client.rename(oldpath,newpath,(err)=>{
                           if(err) throw err;
                           console.log("移动成功")
                           resolve(true)
                      })
               //  })
                 //client.connect(that.config)
             })
         }
         let data=await result();
         return data
      },
      async start(dir){
          let that=this;
             let arr=await that.download(dir);
             let time=that.time();
             let creatdir=await that.makedir(dir,time);
             if(creatdir){
                 for(let i=0;i<arr.length;i++){
                    let name=path.basename(arr[i],'.xml');
                    let succ=await that.yidong(dir+"/"+arr[i],dir+'/'+time+"/"+name+"_backup_"+time+".xml")
                 }
             }
             let xml=xmlpeizhi.data;
             let tojson=new toJson(xml);
             let obj=[]
             for(let i=0;i<arr.length;i++){
                let name=arr[i];
                let data=await that.readFile("/www/download/"+name);
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