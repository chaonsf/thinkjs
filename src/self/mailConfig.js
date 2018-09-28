module.exports={
     config:{
        user: 'chao.li@powerfultone.com', //你的邮箱账号
        password: 'Bft543216', //你的邮箱密码
        host: 'imap.mxhichina.com', //邮箱服务器的主机地址
        port:993, //邮箱服务器的端口地址
        tls: true, //使用安全传输协议
        debug: console.log,
        tlsOptions: { rejectUnauthorized: false } //禁用对证书有效性的检查
     }
}