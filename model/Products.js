const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
   title:String,
   description:String,
   price:Number,
   image:String,
   category:String,
 });

 
 module.exports = mongoose.model('Products', productSchema);

