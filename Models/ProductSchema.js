const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  image: { type: String, require: false }
});
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product