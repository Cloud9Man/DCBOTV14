const { Schema, model } = require('mongoose');

const WelcomeChannelSchema = new Schema(
    {
        guildId: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: true,
            unique: true
        },
        customMessage: {
            type: String,
            required: false,
            default: null
        },
    }, 
    { timestamps: true }
)

module.exports = model('WelcomeChannelSchema', WelcomeChannelSchema);