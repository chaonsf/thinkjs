const ftp=require('ftp')
const fs=require('fs');
var c= new ftp();
module.exports={
    ready(){
        //获取目录列表
        c.on('ready', function() {
            let data="./xml"
            c.list(function(err,list) {
            if (err) throw err;
            console.dir(list);
            c.end();
          }); 
         /*  c.list(data,(err,list)=>{
              if(err) throw err;
              
              for(let t=0;t<list.length;t++){
                  if(list[t].type=="-"){
                    console.log("开始下载了")
                      c.get(data+"/"+list[t].name,(err,stream)=>{
                          if(err) throw err;
                          stream.once('close',()=>{
                              c.end()
                          })
                          stream.pipe(fs.createWriteStream("fuben"+list[t].name))
                          console.log("下载文件夹里的文件成功")
                      })
                  }
              }
              
          }) */
         
         /*  c.put('3.xml', './xml/3.xml', function(err) {
            if (err) throw err;
            console.log("上传成功")
            c.end();
          }); */
          
         /*  c.get('./xml/Export.xml', function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { c.end(); });
            stream.pipe(fs.createWriteStream('foo.local-copy.xml'));
            console.log("下载成功")
          }); */
       
        });
        c.connect({
            host:"139.196.108.200",
            port:"2003",
            user:"lichao",
            password:"Power123"
        });
        
    },
    upload(localPath,remotePath){
       c.put(localPath,remotePath,(err)=>{
           if(err) throw err;
           console.log("上传成功");
           c.end()
       })
    },
    download(remotePath,localPath){
       c.get(remotePath,(err,stream)=>{
           if(err) throw err;
           stream.once("close",()=>{
               c.end();
           })
           stream.pipe(fs.createWriteStream(localPath));
           console.log("下载成功")
       })
    }

}