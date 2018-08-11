const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    idFb: {
        type: Number,
        required: true
    },
    course: {
        type: String
    },
    address: {
        type: String
    },
    numberPhone: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("user", userSchema);