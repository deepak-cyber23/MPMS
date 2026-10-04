import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    content: { type: String, required: true },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    contactEmail: { type: String, default: 'dispatch@mpms-logistics.in' },
    contactPhone: { type: String, default: '+91 80 4568 9200' },
    headquarters: {
      type: String,
      default: 'Plot 42, Peenya Industrial Area Phase II, Bengaluru, Karnataka 560058',
    },
    workingHours: {
      type: String,
      default: 'Mon - Sun: 06:00 AM - 11:00 PM IST (24/7 Fleet Dispatch)',
    },
  },
  { timestamps: true }
);

export const PageModel = mongoose.models.Page || mongoose.model('Page', PageSchema);
export default PageModel;
