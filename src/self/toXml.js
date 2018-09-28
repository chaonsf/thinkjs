//const xpath=require("xpath")
const xmldom=require("xmldom").DOMParser;
const xml2js=require("xml2js")
const jsonPath=require("advanced-json-path");
const fs=require('fs');


module.exports=class {
     constructor(cfg){
         this.cfg=cfg;
     }
     start(data){
        let peizhi=this.cfg;
        let detail=peizhi.details;
        let renameData=this.renameDetail(data,detail);
        renameData=this.operation(detail,renameData);
        renameData=this.deleteItem(peizhi,detail,renameData)
        renameData=this.addparentNode(detail,renameData);
       let xxml=this.toxml(peizhi,renameData)
      // console.log(xxml)
        return xxml;
     }
     //大的父节点的重命名
     renameDetail(data,detail){
         let newObject={}
        for(let i=0;i<detail.length;i++){
             let details=detail[i];
             let path=details.localName
             let y=jsonPath(data,"$.."+path)
             
             if(details.rename){
                 newObject[details.rename]=y
             }else{
                 newObject[details.localName]=y
             }
             
        }
       return newObject
     }
     ignoreJson(child,renameData){
        for(let j=0;j<child.Fields.length;j++){
            let grandson=child.Fields[j];
            if(grandson.type=='ignore'){
            let path=child.localName
            if(child.rename){
               path=child.rename
            }
            let result=jsonPath(renameData,"$."+path)
            if(Object.prototype.toString.call(result)==='[object Array]'){
                for(let t=0;t<result.length;t++){
                    delete renameData[path][t][grandson.ignoreName]
                }
             }else{
                delete renameData[path][grandson.ignoreName]
             }
            }
            
        }
        return renameData
     }
     relatedAttr(renameData,child){
        let parentRelate=jsonPath(renameData,"$."+child.parentNode);
        if(Object.prototype.toString.call(parentRelate)==='[object Array]'){
             for(let j=0;j<parentRelate.length;j++){
                 let relateId=parentRelate[j][child.relatedAttr];
                 let selected=renameData[child.parentNode][j];
                 renameData[child.parentNode][j]=this.childarrayTitle(child,relateId,renameData,selected)
             }
        }else{
            let relateId=parentRelate[child.relatedAttr];
            let selected=renameData[child.parentNode];
            renameData[child.parentNode]=this.childarrayTitle(child,relateId,renameData,selected)
        }
        return renameData
     }
     //删除掉父节点不是根节点的数据
     deleteItem(peizhi,detail,renameData){
        for(let i=0;i<detail.length;i++){
            let child=detail[i];
            if(child.parentNode!=peizhi.rootName){
                if(child.rename){
                    delete renameData[child.rename]
                }else{
                    delete renameData[child.localName]
                }
           } 
        }
        return renameData
     }
     //count和在外包一个节点
     childarrayTitle(child,relateId,renameData,selected){
        let path="$."+child.localName+"[?(@."+child.relatedAttr+"=="+relateId+")]";
        let name=child.localName
        if(child.rename){
            path="$."+child.rename+"[?(@."+child.relatedAttr+"=="+relateId+")]";
            name=child.rename
        }
        let grandson=jsonPath(renameData,path);
        let count;
        let obj={};
       if(Object.prototype.toString.call(grandson)==='[object Array]'){
           count=grandson.length;
       }else if(Object.prototype.toString.call(grandson)==='[object Object]'){
           count=1
       }else{
           count=0
       }
        if(child.childarrayTitle){
             for(let k=0;k<child.Fields.length;k++){
                 let item=child.Fields[k];
                 if(item.type=='add'){
                      obj[item.addName]=item.value;
                      if(item.path){
                        let value=jsonPath(renameData,item.path);
                        console.log(value)
                        obj[item.addName]=value;
                    } 
                 }
             }
            if(child.countName){
             obj[child.countName]=count
            }
         if(count>0){
             obj[name]=grandson
          }
          selected[child.childarrayTitle]=obj
        }else{
           if(child.countName){
              selected[child.countName]=count
           }
           if(count>0){
               selected[name]=grandson
           }
        }
        return selected
     }
     //小的子节点重命名
     childNodeRename(child,renameData){
         for(let i=0;i<child.Fields.length;i++){
              let grandson=child.Fields[i];
              if(grandson.type=='rename'){
                  let result=jsonPath(renameData,grandson.path);
                  if(Object.prototype.toString.call(result)==='[object Array]'){
                      for(let t=0;t<result.length;t++){
                            let childselect=result[t];
                            childselect[grandson.rename]=childselect[grandson.oldname];
                            delete childselect[grandson.oldname]
                      }
                  }else{
                      result[grandson.rename]=result[grandson.oldname];
                      delete result[grandson.oldname]
                  }
              }

         }
         return renameData
     }
     //在最外面追加一个父节点
     addparentNode(detail,renameData){
          for(let i=0;i<detail.length;i++){
              let child=detail[i];
              if(child.addparentNode){
                     let name=child.rename?child.rename:child.localName;
                     let parentNode=child.addparentNode;
                    let selectdata=jsonPath(renameData,"$."+name);
                   // think.logger.info("sele:",selectdata);
                    let t={}
                    t[name]=selectdata;
                     renameData[parentNode]=t;
                   //  think.logger.debug("ree:",renameData);
                     delete renameData[name]
              }
          }
        return renameData  
         
     }
     operation(detail,renameData){
        for(let i=0;i<detail.length;i++){
              let child=detail[i];
            if(child.relatedAttr){
                renameData=this.relatedAttr(renameData,child)
            }
            renameData=this.ignoreJson(child,renameData)
            renameData=this.childNodeRename(child,renameData)
          }
        return renameData  
     }
     toxml(peizhi,renameData){
        let jsonBuilder = new xml2js.Builder({
            rootName:peizhi.rootName,
            xmldec:{
                version:'1.0',
                'encoding': 'utf-8',
                'standalone': false}})    
        let  json2xml = jsonBuilder.buildObject(renameData);
       let doc=new xmldom().parseFromString(json2xml);
       let xxml=doc.toString();
       return xxml
     }
}