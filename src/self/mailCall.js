const queryMail=require('./util');
const mailConfig=require('./mailConfig');
const cache=require('memory-cache');
module.exports={
    async start(){
        let config=new queryMail(mailConfig.config);
        let myDate=new Date();
        let day=myDate.toLocaleDateString();
        let data=await config.start(day);
        let buffer=cache.get(day)
        let arr=[];
        if(buffer){
           let i=buffer.length;
            for(let j=i;j<data.length;j++){
             arr.push(data[j])
            }
            cache.put(day,data) 
        }else{
          cache.clear()
          cache.put(day,data) 
          arr=data
        }
        let array=[];
        for(let i=0;i<arr.length;i++){
            array.push({
                TB_Name:mailConfig.TB_Name,
                SP_Name:mailConfig.SP_Name,
                dataTable:arr[i]
            })
        }
        return array
    }
}