const express = require('express');
const connection = require('../controllers/controller')
const router=express.Router();

// ********* Post Requests *********
router.post('/loginUser',connection.loginUser)

router.post('/verifyAuth',connection.verifyAuth,connection.verifyPage);

router.post('/loginAdmin',connection.loginAdmin)

router.post('/addnewuser', connection.addNewUser)

router.post('/updateProfile/:id',connection.updateProfile)

router.post('/addToCart/:id',connection.addToCart)

router.post('/deleteCart/:id', connection.deleteCart)

router.post('/buyNow/:id', connection.buyNow)

router.post('/deleteMyOrder/:id', connection.deleteMyOrder)

router.post('/confirmOrder',connection.confirmOrder)

router.post('/cancelOrder',connection.cancelOrder)


router.post('/deleteAccount/:id',connection.deleteAccount)

router.post('/addItem',connection.addItem)


// ********* Get Requests *********
router.get('/allOrders', connection.allOrders)

router.get('/fetchMenuItems', connection.fetchMenuItems)

router.get('/fetchUserData/:id',connection.fetchUserData)

router.get('/myOrders/:id',connection.myOrder)

router.get('/fetchCartData/:id',connection.fetchCartData)

router.get('/', connection.connection)   




module.exports=router;
