const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({

    taskName:{
        type:String,
        required:true

    },
    projectId:{
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

module.exports = mongoose.model('Task',taskSchema)