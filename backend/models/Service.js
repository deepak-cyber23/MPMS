import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    category: { type: String, default: 'Relocation' },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    basePrice: { type: Number, required: true, default: 4500 },
    priceUnit: { type: String, default: 'Starting from' },
    estimatedDuration: { type: String, default: '1 - 2 Days' },
    features: [{ type: String }],
    benefits: [{ type: String }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const ServiceModel = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export default ServiceModel;
