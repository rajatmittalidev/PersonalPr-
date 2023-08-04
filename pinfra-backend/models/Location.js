const mongoose = require('mongoose')
const schema = mongoose.Schema;
const config = require('../config/env');

const LocationSchema = new mongoose.Schema({

    location_name:{
        type:String,
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
LocationSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('location',LocationSchema)