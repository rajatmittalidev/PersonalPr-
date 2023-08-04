const mongoose = require('mongoose')
const schema = mongoose.Schema;
const config = require('../config/env');

const projectActivityDataSchema = new mongoose.Schema({

    project_id: {
        type: schema.Types.ObjectId,
        required: true,
    },  
    location_id: {
        type: schema.Types.ObjectId,
        required: true,
    },
    location_ref_id: {
        type: schema.Types.ObjectId,
        required: true,
    },
    structure_id: {
        type: schema.Types.ObjectId,
        required: true,
    },
    structure_ref_id: {
        type: schema.Types.ObjectId,
        required: true,
    },
    activity_id: {
        type: schema.Types.ObjectId,
        required: true,
    },
    activity_ref_id: {
        type: schema.Types.ObjectId,
        required: true,
    },
    daily_quantity: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: null
    },
    remark: {
        type: String,
        default: ""
    },
    created_by: String,
    updated_by: String

},
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    })
projectActivityDataSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('project_activity_data', projectActivityDataSchema)