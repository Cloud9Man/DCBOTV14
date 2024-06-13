const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        quote: {
            type: String,
            default: null,
            required: false
        },
        profileColour: {
            type: String,
            default: null,
            required: false
        },
        thanksReceived: {
            type: Number,
            default: 0,
            required: false
        },
        thanksGiven: {
            type: Number,
            default: 0,
            required: false
        }
    }, 
    { timestamps: true }
)

module.exports = model('UserSchema', UserSchema);