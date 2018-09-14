const fs=require('fs');
const ftp=require('ftp');
let client=new ftp();
module.exports={
      config:{
        host:"139.196.108.200",
        port:"2003",
        user:"lichao",
        password:"Power123"
      },
      dirlist:null,
      async download(dir){
           let arr=[];
           let that=this
           function result(){
               return new Promise((resolve,reject)=>{
                   client.list(dir,(err,list)=>{
                       if(err) throw err;
                       for(let t=0;t<list.length;t++){
                           if(list[t].type=="-"){
                            arr.push(list[t].name);
                                client.get(dir+"/"+list[t].name,(err,stream)=>{
                                   if(err) throw err;
                                   stream.once('close',()=>{
                                    client.end()
                                    
                                })
                                stream.pipe(fs.createWriteStream(think.ROOT_PATH+"/www/download/"+list[t].name))
                                 
                               })
                           }
                            resolve(arr)
                       }
                      
                      
                   })
                   client.connect(that.config)
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
               client.connect(that.config)
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
                  client.connect(that.config)
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
                  client.connect(that.config)
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
                  client.connect(that.config)
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
      }
   
}