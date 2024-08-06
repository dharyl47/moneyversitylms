// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  status: String,
  type: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
