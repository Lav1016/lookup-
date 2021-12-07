const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    gender:{
        type:String
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required : true
    },  
})
module.exports = mongoose.model('Student',studentSchema);