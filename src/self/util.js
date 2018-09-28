const Imap=require("imap");
const  MailParser = require("mailparser").MailParser
let config=require('./mailConfig').config

module.exports= class{
  constructor(cfg) {
    this.cfg = cfg;
    }
  async start(time){
      let data=await new Promise((resolve)=>{
        let imap=new Imap(this.cfg)
        this.imap=imap;
         imap.once('ready',()=>{
              let arr=[]
           this.openInbox((err,box)=>{
                  if(err) throw err;
                  console.log(box)
                  imap.search(['UNSEEN',['SINCE', time]],(err,results)=>{
                       if(err) throw err;
                       if(results.length==0){
                          resolve(arr)
                       }
                       let f=imap.fetch(results, { bodies: '',markSeen:true });
                       f.on('message',(msg, seqno)=>{
                         var mailparser = new MailParser();
                         msg.on("body",(stream, info)=>{
                             stream.pipe(mailparser);//将为解析的数据流pipe到mailparser
                               mailparser.on('data',(data)=>{
                                 if (data.type === 'text') {
                                     let obj=this.grab(data.html);
                                    arr.push(obj)
                                     if(arr.length==results.length){
                                        resolve(arr)
                                     }
                                   }   
                               })
                         })
                        
                         msg.once('end', function() {
                             console.log(seqno + '完成');
                           });
                       })
                       f.once('error', function(err) {
                         console.log('抓取出现错误: ' + err);
                       });
                       f.once('end', function() {
                         console.log('所有邮件抓取完成!');
                         imap.end();
                       });
                  })
 
              })
         })
           imap.once('end', function() {
             console.log('关闭邮箱');
           });
            
           imap.connect();
      })
      return data
      
    }
    openInbox(cb){
      this.imap.openBox('INBOX', false, cb);
    }
    grab(text){
      let re=/(保单号：)(\w+?),/g;
      let re2=/(投保人证件号码：)(\w+?)，/g;
      let re3=/(保险起期：)(.*?)，/g;
      let re4=/(保险止期：)(.*?)，/g;
      let re5=/(被保人姓名：)(.*?)，/g
      let re6=/(投保人电话：)(.*?)，/g
      let policyId=re.exec(text)[2];
      let applicantName=re2.exec(text)[2];
      let startInsurance=re3.exec(text)[2];
      let endInsurance=re4.exec(text)[2];
      let recognizeeName=re5.exec(text)[2];
      let recognizeePhone=re6.exec(text)[2];
      let obj={
          "保单号":policyId,
          "投保人证件号码":applicantName,
          "保险起期":startInsurance,
          "保险止期":endInsurance,
          "被保人姓名":recognizeeName,
          "投保人电话":recognizeePhone
       }
      return obj
    }
   
}