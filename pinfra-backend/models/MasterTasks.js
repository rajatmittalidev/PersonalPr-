const mongoose = require('mongoose')


const masterTaskSchema = new mongoose.Schema({

    taskName:{
        type:String,
        required:true

    },


    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('MasterTask',masterTaskSchema)