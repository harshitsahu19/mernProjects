const mongoose = require('mongoose');
const plm = require ("passport-local-mongoose");

mongoose.connect ('mongodb+srv://harshit19sahu:ZVBRYYzPZP9fHWLh@mycluster.hxk77.mongodb.net/mycluster?retryWrites=true&w=majority&appName=mycluster')

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection successful');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String
    
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],
  dp: {
    type: String, // URL or path to the display picture
  
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  }
});

userSchema.plugin(plm);

module.exports= mongoose.model('User', userSchema);

 
