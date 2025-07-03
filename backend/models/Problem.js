const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  statement: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [String],
  testCases: [
    {
      input: String,
      output: String,
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
