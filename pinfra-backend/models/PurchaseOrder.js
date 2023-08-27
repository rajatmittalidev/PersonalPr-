const mongoose = require('mongoose')
const schema = mongoose.Schema;
const config = require('../config/env');

const PurchaseOrderSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: true
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
                quantity: {
                    type: Number,
                    default: 0
                },
                brand: {
                    type: String,
                    default: ""
                },
                item_rate: {
                    type: Number,
                    default: 0
                },
                item_subtotal: {
                    type: Number,
                    default: 0
                },
                item_total_amount: {
                    type: Number,
                    default: 0
                }
            }
        ]

    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'revise', 'revised'],
        default: 'pending'
    },
    remarks: {
        type: String,
        default: ""
    },
    billing_address: {
        company_name: {
            type: String,
            default: ''
        },
        gst_number: {
            type: String,
            default: ''
        },
        pan_card: {
            type: String,
            default: ''
        },
        contact_person: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
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
    delivery_address: {
        company_name: {
            type: String,
            default: ''
        },
        gst_number: {
            type: String,
            default: ''
        },
        pan_card: {
            type: String,
            default: ''
        },
        contact_person: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
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
PurchaseOrderSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('purchase_order',PurchaseOrderSchema)