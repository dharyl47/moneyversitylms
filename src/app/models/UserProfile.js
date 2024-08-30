import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  propertyRegime: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    default: 'N/A',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;