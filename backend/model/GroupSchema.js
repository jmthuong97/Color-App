const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {
    timestamps: {
        createdAt: "createdAt"
    }
});

module.exports = mongoose.model("group", groupSchema);