import mongoose from 'mongoose';

const downloadLogSchema = new mongoose.Schema({
  authToken: {
    type: String,
    required: true,
    index: true,
  },
  downloadType: {
    type: String,
    required: true,
    enum: ['user_report', 'resource_template'],
    index: true,
  },
  fileName: {
    type: String,
    required: true,
    index: true,
  },
  fileLabel: {
    type: String,
    default: '',
  },
  downloadDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  userAgent: {
    type: String,
    default: '',
  },
  ipAddress: {
    type: String,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Compound indexes for optimized queries
downloadLogSchema.index({ authToken: 1, downloadDate: -1 });
downloadLogSchema.index({ downloadType: 1, downloadDate: -1 });
downloadLogSchema.index({ fileName: 1, downloadDate: -1 });

const DownloadLog = mongoose.models.DownloadLog || mongoose.model('DownloadLog', downloadLogSchema);

export default DownloadLog;
