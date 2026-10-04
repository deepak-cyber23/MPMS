import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    enquiryId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    readStatus: { type: String, enum: ['Unread', 'Read'], default: 'Unread' },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

export const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
export default EnquiryModel;
