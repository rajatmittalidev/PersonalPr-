const mongoose = require('mongoose')
const schema = mongoose.Schema;
const config = require('../config/env');

const StructureSchema = new mongoose.Schema({

    structure_name:{
        type:String,
        required:true

    },
    created_by: String,
    updated_by: String
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})
StructureSchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('structure',StructureSchema)