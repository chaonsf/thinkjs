const Base = require('./base.js');

module.exports = class extends Base {
    indexAction() {
    return this.display();
    }
    async ftpAction(){
       let data=await think.readDocuments('/www/static/ftp.html');
       this.ctx.body=data
    }
};
