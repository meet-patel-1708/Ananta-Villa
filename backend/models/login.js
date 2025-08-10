const mongoose = require('mongoose');
const LoginSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Name: String,
    Age: String,
    Email: String,
    MobileNumber: String,
})
module.exports = mongoose.model('Login',LoginSchema);