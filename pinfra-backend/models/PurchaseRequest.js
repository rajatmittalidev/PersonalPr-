const mongoose = require('mongoose')
const schema = mongoose.Schema;
const config = require('../config/env');

const PurchaseRequestSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    handle_by: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true
    },
    expected_delivery_date: {
        type: Date,
        required: true
    },
    purchase_request_number: {
        type: String,
        required: true
    },
    site: {
        type: schema.Types.ObjectId,
        required: true
    },
    local_purchase: {
        type: String,
        enum: ['yes', 'no'],
        default: 'yes'
    },
    items: [{
        item_id: {
            type: schema.Types.ObjectId,
            required: true
        },
        qty: {
            type: Number,
            required: true,
            default: 1
        },
        attachment: {
            type: String,
            default: ''
        },
        remark: {
            type: String,
            default: ''
        },
        uom: {
            type: String,
            default: ''
        }

    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'revise', 'revised'],
        default: 'pending'
    },
    new_request: {
        type: Boolean,
        default: true
    },
    remarks: {
        type: String,
        default: ""
    },
    created_by: String,
    updated_by: String
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})

PurchaseRequestSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('purchase_request', PurchaseRequestSchema)