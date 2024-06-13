const { Schema, model } = require('mongoose');

const LevelSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        guildId: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            default: 0
        },
        xp: {
            type: Number,
            default: 0
        },
    }, 
    { timestamps: true }
)

module.exports = model('LevelSchema', LevelSchema);