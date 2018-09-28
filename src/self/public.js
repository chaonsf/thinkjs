const fs=require('fs');
const path=require("path");

module.exports={
    async read(url){
        function result(){
            return new Promise((resolve,reject)=>{
                fs.readFile(think.ROOT_PATH+url,"utf-8",(err,data)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(data)
                    }
                })
            })
        }
    let data=await result();
    return data
    }
}