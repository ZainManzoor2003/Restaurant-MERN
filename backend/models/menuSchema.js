
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    item_name: String,
    o_price: Number,
    price: Number,
    image: String,
    item_type: String
})

const Menu = new mongoose.model('Menu', menuSchema);

module.exports=Menu;