const fs=require("fs");
const xml2js=require("xml2js");
const request=require("request")
const ftp=require('ftp');
module.exports={
    async readDocuments(url){
        function result(){
            return new Promise((resolve,reject)=>{
                fs.readFile(think.ROOT_PATH+url,"utf-8",(err,data)=>{
                     if(err){
                         throw err;
                     }else{
                         resolve(data)
                     }
                })
            })
        }
        let data=await result();
        return data
    },
    async xmlToJson(url){
        let xmlParse=new xml2js.Parser({explicitArray: false, ignoreAttrs: true});
        function result(){
             return new Promise((resolve,reject)=>{
                 fs.readFile(think.ROOT_PATH+url,"utf-8",(err,data)=>{
                       xmlParse.parseString(data,(err,data)=>{
                             if(err){
                                  reject(err)
                             }else{
                                 resolve(data)
                             }
                       })
                 })
             }) 
        }
        let data=await result();
        return data;
    },
    async readXml(url){
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
    },
   
    
}