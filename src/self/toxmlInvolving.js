const jsonpeizhi=require("./toxmlPeizhi");
const toXml=require('./toXml');
module.exports={
    //json转xml
     async start(localPath){
         let json=await think.readXml(localPath);
         let shuju=JSON.parse(json);
         let peizhi=jsonpeizhi.data;
         let Toxml=new toXml(peizhi);
         let xml=Toxml.start(shuju);
         console.log(xml);
         return xml
     }
  
}