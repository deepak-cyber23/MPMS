import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    userId: { type: String },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    pickupAddress: { type: String, required: true, trim: true },
    dropAddress: { type: String, required: true, trim: true },
    movingDate: { type: String, required: true },
    propertyType: { type: String, required: true },
    rooms: { type: String, required: true },
    service: { type: String, required: true },
    serviceId: { type: String },
    approximateItems: { type: String, required: true },
    message: { type: String, default: '' },
    estimatedCost: { type: Number, default: 8500 },
    distanceKm: { type: Number, default: 25 },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    remarks: {
      type: String,
      default:
        'Booking request received. Our relocation coordinator will verify inventory shortly.',
    },
    assignedVehicle: { type: String, default: 'Eicher 14ft Closed Container' },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default BookingModel;
