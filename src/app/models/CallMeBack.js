import mongoose from 'mongoose';

// Define schema
const callMeBackRequestSchema = new mongoose.Schema({
  firstName: { type: String, default: 'N/A' },
  lastName: { type: String, default: 'N/A' },
  email: { type: String, default: 'N/A' },
  phone: { type: String, default: 'N/A' },
  status: { type: String, enum: ['pending', 'contacted'], default: 'pending' },
  dateCreated: { type: Date, default: Date.now },
});

// Use the collection name in lowercase to match MongoDB collection
const CallMeBackRequest = mongoose.models.CallMeBackRequest || mongoose.model('CallMeBackRequest', callMeBackRequestSchema);

export default CallMeBackRequest;
