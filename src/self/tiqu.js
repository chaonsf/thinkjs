const Imap=require("imap");
const  MailParser = require("mailparser").MailParser
const fs=require('fs')
const inspect=require('util').inspect;


let imap = new Imap({
    user: 'chao.li@powerfultone.com', //你的邮箱账号
    password: 'Bft543216', //你的邮箱密码
    host: 'imap.mxhichina.com', //邮箱服务器的主机地址
    port:993, //邮箱服务器的端口地址
    tls: true, //使用安全传输协议
    tlsOptions: { rejectUnauthorized: false } //禁用对证书有效性的检查
  });

module.exports={
    start(){
        imap.once('ready',()=>{
             let arr=[]
             this.openInbox((err,box)=>{
                 if(err) throw err;
                 console.log("box:",box)
                 imap.search(['UNSEEN',['SINCE', '09 26, 2018']],(err,results)=>{
                      if(err) throw err;
                      let f=imap.fetch(results, { bodies: '',markSeen:true });
                      f.on('message',(msg, seqno)=>{
                        var mailparser = new MailParser();
                        msg.on("body",(stream, info)=>{
                            stream.pipe(mailparser);//将为解析的数据流pipe到mailparser
                            mailparser.on("headers", function(headers) {
                                console.log("邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                console.log("邮件主题: " + headers.get('subject'));
                                console.log("发件人: " + headers.get('from').text);
                                console.log("收件人: " + headers.get('to').text);
                              });
                              mailparser.on('data',(data)=>{
                                if (data.type === 'text') {//邮件正文
                                     // console.log("邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                    //console.log("邮件内容: " + data.html);
                                    let obj=this.grab(data.html);
                                   // console.log(obj)
                                   arr.push(obj)
                                   console.log(arr)
                                  }
                                  if (data.type === 'attachment') {//附件
                                    //console.log("邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                    //console.log("附件名称:"+data.filename);//打印附件的名称
                                   // data.content.pipe(fs.createWriteStream(data.filename));//保存附件到当前目录下
                                   // data.release();
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
        imap.once('error', function(err) {
            console.log("怎么回事：",err);
          });
           
          imap.once('end', function() {
            console.log('关闭邮箱');
          });
           
          imap.connect();
    },
    openInbox(cb){
        imap.openBox('INBOX', false, cb);
    },
    grab(text){
      let re=/保单号(\s+：|：|\s+：\s+|：\s+)\w+/g
      let re2=/投保人证件号码(\s+：|：|\s+：\s+|：\s+)\w+/g
      let re3=/保险起期(\s+：|：|\s+：\s+|：\s+)\d{4}(-\d{2})+\s+(\d{2}:)+\d{2}/g
      let re4=/保险止期(\s+：|：|\s+：\s+|：\s+)\d{4}(-\d{2})+\s+(\d{2}:)+\d{2}/g
      let re5=/被保人姓名(\s+：|：|\s+：\s+|：\s+)[\u4e00-\u9fa5|A-z]{1,}/g
      let re6=/投保人电话(\s+：|：|\s+：\s+|：\s+)(\d{1,}-\d{1,}|\d{11})/g
      let bb=text.match(re);
      let cc=text.match(re2)
      let dd=text.match(re3)
      let ee=text.match(re4)
      let ff=text.match(re5)
      let gg=text.match(re6)
      let obj={
          "保单号":this.arr(bb),
          "投保人证件号码":this.arr(cc),
          "保险起期":this.arr(dd),
          "保险止期":this.arr(ee),
          "被保人姓名":this.arr(ff),
          "投保人电话":this.arr(gg)
      }
      return obj
    },
    arr(obj){
      let a=obj[0].split("：");
      let c=a[1]
      return c
   },
}