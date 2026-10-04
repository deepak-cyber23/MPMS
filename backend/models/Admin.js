import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: '+91 98450 77890' },
    role: { type: String, default: 'Super Admin' },
    designation: { type: String, default: 'Chief Logistics & Fleet Director' },
  },
  { timestamps: true }
);

export const AdminModel = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export default AdminModel;
