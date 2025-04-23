const mongoose = require("mongoose")
const Schema = mongoose.Schema
const adminSchema = new Schema({
  username:{
    type: String,
    required: [true, 'username is required'],
    unique:true
  },
  name:{
    type: String,
    required: false
  },
  roles:{
    type: [String],
    default: ['user']
  },
  email:{
    type: String,
    required: false,
    unique: true
  },
  hashedPassword:{
    type: String,
    required: [true, 'password is required'],
  },
},
{
  collection: 'admins',
  timestamps: true
})
module.exports = mongoose.model('Admin', adminSchema)