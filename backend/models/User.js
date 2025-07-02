const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
},

  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
    default: '' 
  },
  rating: {
    type: Number,
    default: 0
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: 0
    }
  ],
  contestsGiven: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      default: 0
    }
  ],
  problemsSolved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      default: 0
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
