const mongoose = require('mongoose')


const permissionSchema = new mongoose.Schema({

    permission:{
        type:String,
        required:true

    },
    
   
    date:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Permission',permissionSchema)