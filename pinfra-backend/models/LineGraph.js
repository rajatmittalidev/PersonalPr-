const mongoose = require('mongoose')


const lineGraphSchema = new mongoose.Schema({

    subTaskName:{
        type:String,
        //required:true

    },

    
    subTaskId:{
        type:String,
        //required:true
    },

    projectId:{
        type:String,
        //required:true
    },

    value:{
        type:Number,
        //required:true
    },

    date:{
        type:Date
    },


    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('LineGraph',lineGraphSchema)