const xpath=require("xpath")
const xmldom=require("xmldom").DOMParser;
module.exports = class  {
    constructor(cfg) {
        this.cfg = cfg;
    }
    invoke(data){
        let doc=new xmldom().parseFromString(data);
        let postData=[];
        let xml=this.cfg;
        for(let i=0;i<xml.length;i++){
            let selectValue=xml[i]
            let path="//"+selectValue.parentNode+"/"+selectValue.searchNode;
            if(!selectValue.parentNode)
            {
              path="//"+selectValue.searchNode
            }
            postData.push({
              DB_NAME:selectValue.DB_NAME,
              TB_NAME:selectValue.TB_NAME,
              datatable:[]
            })
           let data=this.mainCycle(selectValue,path,doc)
            postData[i].datatable=data;   
        }
        return postData
    }
    //需要忽略的字段
   /*  _existsIgnore(tablename,key){
         this. _existsobj=this._existsobj ||{}
         let ignoreArr=this._existsobj[tablename];
         if(!ignoreArr){
             ignoreArr=[];
            let arr=this.cfg.filter(function(item){
                   return item.TB_NAME==tablename
             })
             let fields=arr[0].fields;
             for(let t=0;t<fields.length;t++){
                if(fields[t].type=="ignore"){
                    ignoreArr.push(fields[t].fieldName)
                }
            } 
           this._existsobj[tablename]=ignoreArr;       
         }
         let selectIgnore=ignoreArr.filter(function(item){
            return item==key
        })
        return selectIgnore
    } */
    //需要添加的字段
    _existsAdd(data,fields,doc){
        for(let t=0;t<fields.length;t++){
            if(fields[t].type=="add"){
            let addData=xpath.select(fields[t].xpath,doc);
            if(addData){
            let elementData=addData[0]
            let fieldName=elementData.nodeName;
             let value=elementData.textContent;
             if(fields[t].columnName){
             let name=fields[t].columnName;
              data[name]=value
               }else{
               data[fieldName]=value;
              }
            }else{
                let typeName=fields[t].columnName;
                data[typeName]=""
            }
             
            }
        }
    }
    //y代表当前配置数据
    mainCycle(y,path,doc){
        let childArr=[];
        let fields=y.fields;
        let  elementNode=xpath.select(path,doc);
        for(let k=0;k<elementNode.length;k++){
             let currectData=elementNode[k];
             let nodechilds=currectData.childNodes;
            let t={};
            if(y.clone==1){
             for(let j=0;j<nodechilds.length;j++){
                 if(!nodechilds[j].textContent ||  (nodechilds[j].nodeType==1&&nodechilds[j].childNodes.length==1&&nodechilds[j].childNodes[0].nodeType==3)){
                     let key=nodechilds[j].nodeName;
                       let ElementValue=nodechilds[j].textContent;
                        //let selectIgnore=this. _existsIgnore(y.TB_NAME,key)
                        let selectIgnore=this.ignoreType(fields,key)
                       if(selectIgnore.length==0){
                           t[key]=ElementValue
                          
                       }      
                 }
             }
              this._rename(t,fields,currectData);
            }
            this._existsAdd(t,fields,currectData);
            childArr.push(t)
        }
        return childArr
    }
    //直接改名的字段
    _rename(data,fields,doc){
        for(let t=0;t<fields.length;t++){
            if(fields[t].type=='rename'){
                let elementData=xpath.select(fields[t].xpath,doc)[0];
                let value=elementData.textContent;
                let fieldName=elementData.nodeName;
               let name=fields[t].columnName;
                data[name]=value;
                delete data[fieldName]
            }
        }
    }
    //需要忽略的字段
    ignoreType(fields,key){
        let arr=[];
        for(let t=0;t<fields.length;t++){
            if(fields[t].type=='ignore'){
                 arr.push(fields[t].fieldName)
            }
        }
        let selectIgnore=arr.filter((item)=>{
             return item==key
        })
        return selectIgnore
    }
}
