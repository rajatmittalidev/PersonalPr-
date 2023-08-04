const mongoose = require('mongoose');
const schema = mongoose.Schema;
const config = require('../config/env');

const SiteSchema = new mongoose.Schema({

    site_name:{
        type:String,
        required:true

    },
    location:{
        type:String,
        required:true
    },
    code:{
        type:Number,
        required:true
    },
    address:{
        street_address: {
            type: String,
            default: ''
        },
        street_address2: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        zip_code: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
    },
    store_manager:{
        type:String,
        required:true,
        defaule:''
    },
    store_manager_phone_number_dialcode:{
        type: Number,
        default: ''
    },
    store_manager_phone_number:{
        type: Number,
        default: ''
    },
    site_manager_email:{
        type:String,
        required:true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (email) {
                return /^([\w-\.+]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
            },
            message: '{VALUE} is not a valid email address'
        },
    },
    created_by: String,
    updated_by: String
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})






SiteSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('site',SiteSchema)