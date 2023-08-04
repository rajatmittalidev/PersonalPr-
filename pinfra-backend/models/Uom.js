const mongoose = require('mongoose')
const config = require('../config/env');

const UomSchema = new mongoose.Schema({
    uom_name: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    created_by: String,
    updated_by: String
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})

UomSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('uom', UomSchema);