const mongoose = require('mongoose')

const PurchaseOrderSchema = new mongoose.Schema({

    purchaseorder:[{
        vendors:[{
            vendorId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'vendor'
            },
            billingAddress:{
                company:{type:String,required:true},
                address:{type:String, required:true},
                gst:String,
                pan:String,
                contactPerson:String,
                email:String
            },
            deliveryAddress:{
                date:Date,
                validity:Date,
                poNumber:String,
                address:String,
                contactPerson:String

            },
            vendorDetails:{
                address:String,
                pan:String,
                gst:String,
                terms:String
            },
            items:[{
                itemId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Item'
                },
                itemNumber:String,
                itemDescription:String,
                grossVolume:Number,
                uom:{
                    uomId:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:'Uom'
                    },
                    uomName:String
                },
                qty:Number,
                rate:Number,
                amount:Number,
                gst:{
                    gstId:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:'Gst'
                    },
                gstPercentage:Number,
                
                },
                remarks:String  
            }]
        }],
        totalAmount:Number,
        gstAmount:Number,
        frieght:Number,
        frieghtGst:Number,
        grandTotal:Number,
        paymentTerms:String,
    }],
    status:{
        type:Number,
        required:true
    },
    newRequest:{
        type:Number,
        require:true
    },
    remarks:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('purchaseorder',PurchaseOrderSchema)