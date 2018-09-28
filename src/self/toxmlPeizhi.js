module.exports={
    data:{
        rootName:"root",
        details:[
            {
                localName:"datatable[0]",
                rename:"title",
                parentNode:'root',
                Fields:[
                    {   type:"rename",
                        rename:"h1",
                        path:"$..title[0]",
                        oldname:"title",
                    }
                ]

            },
            {
                localName:"datatable[1]",
                rename:"item",
                parentNode:'root',
                addparentNode:"items",
                Fields:[
                    {   type:"ignore",
                        ignoreName:"claim_no"
                    }
                ]
            },{
                localName:'datatable[2]',
                rename:'sub_item',
                parentNode:"item",
                relatedAttr:"fid",//与父元素的相关元素id
                countName:"A3Count",//统计个数，并生成一个字节
                childarrayTitle:"subA2",//在其父元素里面在加一个父元素。
                Fields:[
                    {   type:"ignore",
                        ignoreName:"claim_no"  
                    },
                    {    
                        type:"ignore",
                        ignoreName:"fid"
                    },
                    {
                       type:"add",
                       addName:"chao",
                       value:"我是添加",
                      
                    }
                ]
            }
        ]

    }   
} 
/* Fields
  type：add  ignore rename,

 */