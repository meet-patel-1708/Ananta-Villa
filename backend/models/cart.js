const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Email:String,
    RoomId:String,
    Title:String,
    Price:String,
    Adults:Number,
    Childern:Number,
    CheckInDate:Date,
    CheckOutDate:Date,
    Image:String,
    Size:String,
    Bed:Number,
})
module.exports = mongoose.model('Cart',cartSchema);