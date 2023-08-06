const mongoose = require("mongoose");
const schema = mongoose.Schema;
const config = require('../config/env');

const NumberingGroupSchema = new schema({
    next_id:{
        type: Number,
        default:0
    },
    module:{
        type:String,
        enum:['purchase_request','rate_approval'],
        default:''
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

NumberingGroupSchema.set('autoIndex', config.db.autoIndex);

module.exports = mongoose.model("numbering_group", NumberingGroupSchema);
