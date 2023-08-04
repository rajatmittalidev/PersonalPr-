const mongoose = require('mongoose')
const schema = mongoose.Schema;
const config = require('../config/env');

const ItemSchema = new mongoose.Schema({

    item_name:{
        type:String,
        required:true
    },
    item_number:{
        type:Number,
        required:true
    },
    category:{
        type:schema.Types.ObjectId,
        required:true
    },
    sub_category:{
        type:schema.Types.ObjectId,
        required:true
    },
    uom:{
        type:schema.Types.ObjectId,
        required:true
    },
    gst:{
        type:schema.Types.ObjectId,
        required:true
    },
    specification:{
        type:String,
        default:''
    },
    created_by: String,
    updated_by: String
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})
ItemSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('item',ItemSchema)