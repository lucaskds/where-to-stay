const mongoose = require('mongoose');

exports.GuestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        document: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
