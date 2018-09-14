const xpath=require("xpath")
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
        let renameData=this.renameDetail(data,detail)
        for(let i=0;i<detail.length;i++){
            let child=detail[i];
            renameData=this.ignoreJson(child,renameData)
            //关联关系
            if(child.relatedAttr){
                renameData=this.relatedAttr(renameData,child)
               
            }
        }
        //console.log("rename:",renameData)
        renameData=this.deleteItem(peizhi,detail,renameData)
        let jsonBuilder = new xml2js.Builder({
            rootName:peizhi.rootName,
            xmldec:{
                version:'1.0',
                'encoding': 'utf-8',
                'standalone': false}})    
        let  json2xml = jsonBuilder.buildObject(renameData);
       let doc=new xmldom().parseFromString(json2xml);
       let xxml=doc.toString()
       fs.writeFile("3.xml",xxml,"utf-8",(err)=>{
        if(err) throw err;
      })
        return renameData
        //下面是用xpath
       /*  let jsonBuilder = new xml2js.Builder({
            rootName:peizhi.rootName,
            xmldec:{
                version:'1.0',
                'encoding': 'utf-8',
                'standalone': false}})    
        let  json2xml = jsonBuilder.buildObject(renameData);
       let doc=new xmldom().parseFromString(json2xml);
       for(let i=0;i<detail.length;i++){
           let selectValue=detail[i];
            doc=this.deleteIgnore(selectValue,doc);
            this.whetherRelatedAttr(selectValue,doc,renameData)
          
       }
       console.log(doc.toString())
       let xxml=doc.toString()
     fs.writeFile("2.xml",xxml,"utf-8",(err)=>{
          if(err) throw err;
          console.log("文件已保存")
     })  */  

      
     }
     //去除忽略项xml
     deleteIgnore(selectValue,doc){
        for(let f=0;f<selectValue.ignoreFields.length;f++){
            let fields=selectValue.ignoreFields[f]
            let nodes=xpath.select("//"+selectValue.localName+"/"+fields.ignoreName,doc);
            for(let t=0;t<nodes.length;t++){
                doc.removeChild(nodes[t])
            }
        }
        return doc
     }
     //是否有childarrayTitle
     whetherTitle(selectValue,doc,renameData){
         let newel;
         let newel2;
        if(selectValue.childarrayTitle){
            newel=doc.createElement(selectValue.childarrayTitle);
            if(selectValue.addFields){
                for(let y=0;y<selectValue.addFields.length;y++){
                    let add=selectValue.addFields[y];
                   let addNew=doc.createElement(add.addName)
                     if(add.value){
                       addNew.textContent=add.value
                     }else{
                         addNew.textContent=jsonPath(renameData,add.path)
                     }
                     newel.appendChild(addNew)
                }
            }
           if(selectValue.countName){
                newel2=doc.createElement(selectValue.countName);
               newel.appendChild(newel2)
           }
       }else{
           if(selectValue.countName){
              newel2=doc.createElement(selectValue.countName);
           }
           
       }
       return {"newel":newel,"newel2":newel2}
     }
     whetherRelatedAttr(selectValue,doc,renameData){
        if(selectValue.relatedAttr){
            let nodes=xpath.select("//"+selectValue.parentNode+"/"+selectValue.relatedAttr,doc);
            let nodeChild=xpath.select("//"+selectValue.localName+"/"+selectValue.relatedAttr,doc);
            for(let j=0;j<nodes.length;j++){
              let returnValue=this.whetherTitle(selectValue,doc,renameData);
              let newel=returnValue.newel;
              let newel2=returnValue.newel2
                 let count=0;
                for(let k=0;k<nodeChild.length;k++){
                    if(nodes[j].textContent==nodeChild[k].textContent){
                        count++;
                        if(newel){
                             if(newel2){
                                 newel2.textContent=count
                             }
                            newel.appendChild(nodeChild[k].parentNode)
                            nodes[j].parentNode.appendChild(newel)
                        }else{
                            if(newel2){
                                 newel2.textContent=count
                                nodes[j].parentNode.appendChild[newel2];
                                nodes[j].parentNode.appendChild(nodeChild[k].parentNode)
                            }
                        }
                    }
                    
                }
            }
        }

     }
     renameDetail(data,detail){
         let newObject={}
        for(let i=0;i<detail.length;i++){
             let details=detail[i];
             let path=details.localName
             let y=jsonPath(data,"$."+path)
             
             if(details.rename){
                 newObject[details.rename]=y
             }else{
                 newObject[details.localName]=y
             }
             
        }
        
       return newObject
     }
     //jsonPath
     ignoreJson(child,renameData){
        for(let j=0;j<child.ignoreFields.length;j++){
            let grandson=child.ignoreFields[j];
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
        return renameData
     }
     relatedAttr(renameData,child){
        let parentRelate=jsonPath(renameData,"$."+child.parentNode)
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
     childarrayTitle(child,relateId,renameData,selected){
        let path="$."+child.localName+"[?(@."+child.relatedAttr+"=="+relateId+")]";
        let name=child.localName
        if(child.rename){
            path="$.."+child.rename+"[?(@."+child.relatedAttr+"=="+relateId+")]";
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
            if(child.addFields){
                for(let k=0;k<child.addFields.length;k++){
                    let item=child.addFields[k];
                     obj[item.addName]=item.value
                    if(item.path){
                        let value=jsonPath(renameData,item.path);
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
    

}