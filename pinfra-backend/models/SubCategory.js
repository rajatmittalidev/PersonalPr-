const mongoose = require('mongoose');
const schema = mongoose.Schema;
const config = require('../config/env');


const SubCategorySchema = new mongoose.Schema({
  subcategory_name: {
    type: String,
    required: true,
  },
  category: {
    type: schema.Types.ObjectId,
    required: true,
  },
  created_by: String,
  updated_by: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});








SubCategorySchema.set('autoIndex', config.db.autoIndex);
module.exports = mongoose.model('sub_category', SubCategorySchema);