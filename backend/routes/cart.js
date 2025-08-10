const express = require('express');
const router =  express.Router();
const Cart = require('../models/cart');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const {error,log} = require('console');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const roomName = req.body.Email.toLowerCase().replace(/[@.]/g,'_');
        const dir = path.join(__dirname,'../cart-images',userEmail);
        fs.mkdirSync(dir,{recursive:true});
        cb(null,dir);
    },
    filename:function(req,file,cb){
        cb(null,`cart-image${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage:storage});

router.get('/',async(req,res)=>{
    try{
        const carts = await Cart.find({});
        const baseURL = `${req.protocol}://${req.get('host')}`;
        const updatedCarts = carts.map(item=>{
            const cleanItem = item.toObject();
            if(cleanItem.Image){
                cleanImage.Image = `${baseURL}${cleanItem.Image}`.replace(/([^:]\/)\/+/g, "$1"); 
            }
            return cleanItem;
        });
        res.json(updatedCarts);
    }catch(error){
        console.log('Error Fetching Cart Item:',error);
        res.status(500).json({message:error.message});
    }
});

router.post('/',upload.single('Image',async(req,res)=>{
    try{
        const userEmail = req.body.Email.toLowerCase().replace(/[@.]/g,'_');
        const cartData ={
            _id:new mongoose.Types.ObjectId(),
            Email:req.body.Email,
            RoomId:req.body.RoomId,
            Title:req.body.Title,
            Price:req.body.Price,
            Childern:req.body.Childern,
            Adults:req.body.Adults,
            CheckInDate:req.body.CheckInDate,
            CheckOutDate:req.body.CheckOutDate,
            Size:req.body.Size,
            Bed:req.body.Bed,
        }
        if(req.file){
            cartData.Image = `cart-images/${userEmail}/cart-image${path.extname(req.file.originalname)}`;
        }
        const cartItem = new Cart(cartData);
        const savedItem = await cartItem.save();

        res.status(201).json({
            success: true,
            data: savedItem,
            message: 'Cart item added successfully'
        });
    }catch(error){
        console.error('Error saving cart item:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}))

router.delete('/:id',async(req,res)=>{
    try{
        const cartItem = await Cart.findById(req.params.id);

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        const userEmail = cartItem.Email.toLowerCase().replace(/[@.]/g, '_');
        const imageDir = path.join(__dirname, '../cart-images', userEmail);

        if (fs.existsSync(imageDir)) {
            fs.rmSync(imageDir, { recursive: true, force: true });
        }

        await Cart.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Cart item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ success: false, message: 'Error deleting cart item', error: error.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const cartItem = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        res.json({ success: true, data: cartItem, message: 'Cart item updated successfully' });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ success: false, message: 'Error updating cart item', error: error.message });
    }
});
module.exports = router;