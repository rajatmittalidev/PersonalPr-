const mongoose = require('mongoose')


const roleSchema = new mongoose.Schema({

    role:{
        type:String,
        required:true

    },

    dashboard_permissions: { type : Array , "default" : 
    

    [
        {

            isAllSelected : false,
            isAllCollapsed : false,
        ParentChildchecklist:[
            {
              id: 1,moduleName: 'projects',isSelected: false,isClosed:false,
              childList: [
                {
                  id: 1,parent_id: 1,value: 'add',isSelected: false
                },
            
                {
                  id: 5,parent_id: 1,value: 'view',isSelected: false
                },
                {
                  id: 3,parent_id: 1,value: 'Edit',isSelected: false
                },
            
                {
                  id: 6,parent_id: 1,value: 'Delete',isSelected: false
                }
              ]
            },
      
            {
              id: 2,moduleName: 'progress_sheet',isSelected: false,isClosed:false,
              childList: [
                {
                  id: 2,parent_id: 1,value: 'edit',isSelected: false
                },
                {
                  id: 5,parent_id: 1,value: 'view',isSelected: false
                },
              ]
            },
      
            {
              id: 3,moduleName: 'calender',isSelected: false,isClosed:false,
              childList: [
                {
                  id: 1,parent_id: 1,value: 'add',isSelected: false
                },
                {
                  id: 5,parent_id: 1,value: 'view',isSelected: false
                },
                {
                  id: 5,parent_id: 1,value: 'remarks',isSelected: false
                },
              ]
            },
      
            {
              id: 4,moduleName: 'roles',isSelected: false,isClosed:false,
              childList: [
                {
                  id: 1,parent_id: 1,value: 'add',isSelected: false
                },
                {
                  id: 2,parent_id: 1,value: 'edit',isSelected: false
                },
                {
                  id: 3,parent_id: 1,value: 'delete',isSelected: false
                },
                // {
                //   id: 4,parent_id: 1,value: 'deleteMultiple',isSelected: false
                // },
                {
                  id: 5,parent_id: 1,value: 'view',isSelected: false
                },
              ]
            },
      
            {
              id: 5,moduleName: 'users',isSelected: false,isClosed:false,
              childList: [
                {
                  id: 1,parent_id: 1,value: 'add',isSelected: false
                },
                {
                  id: 2,parent_id: 1,value: 'edit',isSelected: false
                },
                {
                  id: 3,parent_id: 1,value: 'delete',isSelected: false
                },
                // {
                //   id: 4,parent_id: 1,value: 'deleteMultiple',isSelected: false
                // },
                {
                  id: 5,parent_id: 1,value: 'view',isSelected: false
                },
              ]
            },
      
      
            {
              id: 7,moduleName: 'members',isSelected: false,isClosed:false,
              childList: [
                {
                  id: 1,parent_id: 1,value: 'add',isSelected: false
                }
      
              
              ]
            },
            {
                id: 4,moduleName: 'activities',isSelected: false,isClosed:false,
                childList: [
                  {
                    id: 1,parent_id: 1,value: 'add',isSelected: false
                  },
                  {
                    id: 2,parent_id: 1,value: 'edit',isSelected: false
                  },
                  {
                    id: 3,parent_id: 1,value: 'delete',isSelected: false
                  },
                  // {
                  //   id: 4,parent_id: 1,value: 'deleteMultiple',isSelected: false
                  // },
                  {
                    id: 5,parent_id: 1,value: 'view',isSelected: false
                  },
                ]
              },
        
              {
                id: 4,moduleName: 'sub activities',isSelected: false,isClosed:false,
                childList: [
                  {
                    id: 1,parent_id: 1,value: 'add',isSelected: false
                  },
                  {
                    id: 2,parent_id: 1,value: 'edit',isSelected: false
                  },
                  {
                    id: 3,parent_id: 1,value: 'delete',isSelected: false
                  },
                  // {
                  //   id: 4,parent_id: 1,value: 'deleteMultiple',isSelected: false
                  // },
                  {
                    id: 5,parent_id: 1,value: 'view',isSelected: false
                  },
                ]
              }
      
           
      
      
      
       
          ]
        }
    ]


    
     },
    
   
    date:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Role',roleSchema)