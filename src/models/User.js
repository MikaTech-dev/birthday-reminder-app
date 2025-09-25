const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  }
  ,
  isEmailed: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

// Validation schema using Joi
const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    dateOfBirth: Joi.date().max('now').required()
  });
  return schema.validate(user);
};

userSchema.statics.validate = validateUser;

module.exports = mongoose.model('User', userSchema);