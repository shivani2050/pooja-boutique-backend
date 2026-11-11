const mongoose = require('mongoose')

const leadschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 10,
        match: /^[0-9]{10}$/
    }
    ,
    email: {
        type: String,
        trim: true,
        default: ""
    },
    service: {
        type: String,
        required: true,
        trim: true,

    },
    message: {
        type: String,
        trim: true,
        default: "",
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
}, {
    timestamps: true
})


const lead = mongoose.model("Lead", leadschema)

module.exports = lead;




