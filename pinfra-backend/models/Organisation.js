const mongoose = require('mongoose')
const config = require('../config/env');


const OrganisationSchema = new mongoose.Schema({

    location:{
        type:String,
        required:true
    },
    contact_person:{
        type:String,
        default: ''
    },
    designation:{
        type:String,
        default: ''
    },
    dialcode:{
        type: Number,
        required:true
    },
    phone_number:{
        type: Number,
        required:true
    },
    gst_number:{
        type:String,
        default: ''
    },
    pan_number:{
        type:String,
        require:true
    },
    email:{
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
    attachments:{
        type:String,
        default: ''
    },
    created_by: String,
    updated_by: String
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})

OrganisationSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('organisation',OrganisationSchema)