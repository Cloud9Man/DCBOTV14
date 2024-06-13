const mongoose = require('mongoose');

const StartedSchema = new mongoose.Schema({
    botID: String,
    startedTimes: Number,
}) 

module.exports = mongoose.model('StartedSchema', StartedSchema);