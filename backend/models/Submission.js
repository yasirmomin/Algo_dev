const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem',
            required: true
        },
        code: {
            type: String,
            required: true
        },
        language: {
            type: String,
            enum: ['cpp', 'java', 'python', 'javascript'],
            required: true
        },
        output: {
            type: String,
        },
        verdict: {
            type: String,
            required: true
        },
    },
    { timestamps: true, }
);

module.exports = mongoose.model('Submission', submissionSchema);