const mongoose = require('mongoose')
const schema = mongoose.Schema;
const config = require('../config/env');

const RateApprovalSchema = new mongoose.Schema({


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
    purchase_request_id: {
        type: schema.Types.ObjectId,
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
        tax: {
            amount: Number,
            name: String
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
        vendors: [
            {
                vendor_id: {
                    type: schema.Types.ObjectId,
                    required: true
                },

                item_rate: {
                    type: Number,
                    default: 0
                },
                item_subtotal: {
                    type: Number,
                    default:0
                },
                item_total_amount: {
                    type: Number,
                    default: 0
                },
            }
        ]

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

    vendors_total: [
        {
            vendor_id: {
                type: schema.Types.ObjectId,
                required: true
            },

            subtotal: {
                type: Number,
                default: 0
            },
            total_tax: {
                type: Number,
                default: 0
            },
            freight_charges: {
                type: Number,
                default: 0
            },
            freight_tax: {
                type: Number,
                default: 0
            },
            total_amount: {
                type: Number,
                default: 0
            },
        }
    ],  
    created_by: String,
    updated_by: String
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})
RateApprovalSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('rate_approval', RateApprovalSchema)