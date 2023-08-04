const mongoose = require('mongoose')


const aboutUsSchema = new mongoose.Schema({

    description:{
        type:String,
        required:true

    },

    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('AboutUs',aboutUsSchema)