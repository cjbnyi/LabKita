/* This is a sample schema for reference. */

const mongoose = require('mongoose');

const SampleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Sample = mongoose.model('Sample', SampleSchema);

module.exports = Sample;
