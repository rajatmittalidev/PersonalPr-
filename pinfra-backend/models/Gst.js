const mongoose = require('mongoose')
const config = require('../config/env');

const GstSchema = new mongoose.Schema({
    gst_name:{
        type:String,
        required:true
    },
    gst_percentage:{
        type:Number,
        required:true
    },
    created_by: String,
    updated_by: String
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})




GstSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('gst',GstSchema)