const mongoose = require('mongoose')
const schema = mongoose.Schema;
const config = require('../config/env');

const CategorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true

    },
    code:{
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








CategorySchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('category',CategorySchema)