const User = require('../models/userSchema')
const Admin = require('../models/adminSchema')
// const Cart = require('../models/cartSchema')
const Order = require('../models/orderSchema')
const Menu = require('../models/menuSchema')
var jwt = require('jsonwebtoken');

const connection = (req, res) => {
    res.send("Hello");
}

const verifyAuth = (req, res, next) => {
    const token = req.body.cookie;
    if (!token) {
        res.send({ mes: 'Token Missing' })
    }
    else {
        jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
            if (err) {
                res.send({ mes: 'Error with token' })
            }
            else {
                next();
                // console.log(decoded);
            }
        })
    }
}

const verifyPage = (req, res) => {
    res.send({ mes: "Success" });
}

const loginUser = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username }).then((user, err) => {
        if (user) {
            if (password === user.password) {
                const tokenData = {
                    username: user.username,
                    id: user._id
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY);
                res.send({ message: 'Login Successfull', id: user._id, token });
            }
            else {
                res.send({ message: 'Wrong Password' });
            }
        }
        else {
            res.send({ message: 'User Not Found' });
        }
    })
}

const loginAdmin = (req, res) => {
    const adminData = req.body;
    Admin.findOne({ username: adminData.username }).then((admin, err) => {
        if (admin) {
            if (adminData.password === admin.password) {
                const tokenData = {
                    username: admin.username,
                    id: admin._id
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY);
                res.send({ message: 'Login Successfull', id: admin.id, token })
            }
            else {
                res.send({ message: 'Wrong Password' });
            }
        }
        else {
            res.send({ message: 'Admin Not Found' });
            console.log(err);
        }

    })
}

const addNewUser = (req, res) => {
    User.findOne({ username: req.body.username }).then((user, err) => {
        if (user) {
            res.send({ message: "Account Already Registered" });
        }
        else {
            const user = new User(req.body);
            user.save().then((user, err) => {
                if (user) {
                    res.send({ message: "Account Created Succesfully" })
                }
                else {
                    console.log(err);
                }
            })
        }
    })
}

const fetchUserData = async (req, res) => {
    try {
        // console.log(req.params.id);
        const UserData = await User.find({ _id: req.params.id });
        if (UserData) {
            res.send(UserData);
        }
        else {
            console.log('Nothing Found in Users Schema');
        }
    } catch (err) {
        console.log((err));
    }
}

const updateProfile = async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.params.id);
        const user = await User.updateOne({ _id: req.params.id }, req.body)
        if (user) {
            // console.log(user);
            res.send({ message: "Account Updated Successfully" })
        }
        else {
            res.send({ message: "Account Not Updated" });
        }
    } catch (err) {
        console.log(err);
    }
}

const addToCart = async (req, res) => {
    let { menuId } = req.body;
    // console.log(menuId);
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (user.carts.includes(menuId)) {
            res.send({ message: "Already Added" })
        }
        else {
            user.carts.push(menuId);
            await user.save();
            res.send({ message: "Added to Cart" })
        }
    } catch (err) {
        console.log(err);
    }
}

const fetchCartData = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate("carts");
        res.send(user.carts);
    } catch (err) {
        console.log(err);
    }
}

const deleteCart = async (req, res) => {
    let { menuId } = req.body;
    try {
        const user = await User.findOne({ _id: req.params.id });
        const index = user.carts.indexOf(menuId);
        if (index !== -1) {
            user.carts.splice(index, 1);
            await user.save();
            res.send({ message: "Item Deleted from Cart" })
        }
    } catch (err) {
        console.log(err);
    }

}

const buyNow = async (req, res) => {
    const order = {
        item_name: req.body.order.item_name, price: req.body.order.price, item_type: req.body.order.item_type, status: 'pending'
    };
    try {
        const user = await User.findOne({ _id: req.params.id });
        const newOrder = new Order(order);
        newOrder.save().then(async (order, err) => {
            if (order) {
                user.orders.push(order._id); //push order id
                await user.save();
                res.send({ message: "Order Placed Successfully" });
            }
            else {
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err);
    }
}

const myOrder = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate("orders");
        res.send(user.orders)
    } catch (err) {
        console.log(err);
    }
}

const deleteMyOrder = async (req, res) => {
    try {
        await Order.deleteOne({ _id: req.body.id }).then(async (order, err) => {
            if (order) {
                const user = await User.findOne({ _id: req.params.id });
                const index = user.orders.indexOf(req.body.id); // order id
                if (index !== -1) {
                    user.orders.slice(index, 1);
                    await user.save();
                    res.send({ message: "Order Deleted Successfully" });
                }
            }
            else {
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err);
    }
}
const allOrders = async (req, res) => {
    try {
        const orderData = await Order.find({ status: 'pending' });
        if (orderData) {
            res.send(orderData);
        }
        else {
            console.log('Error while fetching all oredrs');
        }
    } catch (err) {
        console.log(err);
    }
}
const confirmOrder = async (req, res) => {
    try {
        const order = await Order.updateOne({ _id: req.body.id }, { status: 'confirmed' });
        if (order) {
            res.send({ message: "Order Status Confirmed Successfully" });
        }
    } catch (err) {

        console.log(err);
    }
}
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.updateOne({ _id: req.body.id }, { status: 'cancelled' });
        if (order) {
            res.send({ message: "Order Cancelled Successfully" });
        }
    } catch (err) {

        console.log(err);
    }
}
const deleteAccount = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id })
        await Cart.deleteMany({ user_id: req.params.id });
        await Order.deleteMany({ user_id: req.params.id });
        res.send({ message: "Your Account and all associated data deleted" })
    } catch (err) {
        console.log(err);
    }
}
const addItem = async (req, res) => {
    try {
        const menu = new Menu(req.body);
        menu.save().then((item, err) => {
            if (item) {
                res.send({ message: "Item Added Successfully" });
            }
            else {
                res.send({ message: "Error while Item" });
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err);
    }
}

const fetchMenuItems = async (req, res) => {
    const menuData = await Menu.find({});
    if (menuData) {
        res.send(menuData);
    }
    else {
        console.log('Nothing Found in Menu Schema');
    }
}
module.exports = {
    connection, verifyAuth, verifyPage, loginUser, loginAdmin, addNewUser, fetchUserData, updateProfile, addToCart, fetchCartData, deleteCart, buyNow
    , myOrder, deleteMyOrder, allOrders, confirmOrder, cancelOrder, deleteAccount, addItem, fetchMenuItems
}