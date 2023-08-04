const mongoose = require('mongoose')


const masterSubTaskSchema = new mongoose.Schema({

    subTaskName:{
        type:String,
        required:true

    },

    taskId:{
        type:String,
        required:true

    },


    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('MasterSubTask',masterSubTaskSchema)