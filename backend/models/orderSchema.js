
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    item_name: String,
    price: Number,
    item_type: String,
    status: String
})
const Order = new mongoose.model('Order', orderSchema);

module.exports=Order;