import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    engagingID: { type: String },
    engagingVideo: { type: String },
    engagingImage: { type: String  },

});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
