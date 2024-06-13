const { Schema, model } = require('mongoose');

const ThanksSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        guildId: {
            type: String,
            required: true
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
        },
        lastGave: {
            type: Date,
            required: false
        }
    }, 
    { timestamps: true }
)

module.exports = model('ThanksSchema', ThanksSchema);