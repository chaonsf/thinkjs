module.exports={
    data:{
        rootName:"root",
        details:[
            {
                localName:"datatable[0]",
                rename:"title",
                parentNode:'root',
                ignoreFields:[
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
                ignoreFields:[
                    {   type:"ignore",
                        ignoreName:"claim_no"
                    }
                ]
            },{
                localName:'datatable[2]',
                rename:'sub_item',
                parentNode:"item",
                relatedAttr:"fid",
                ignoreFields:[
                    {   type:"ignore",
                        ignoreName:"claim_no"  
                    },
                    {    
                        type:"ignore",
                        ignoreName:"fid"
                    }
                ]
            }
        ]

    }   
} 