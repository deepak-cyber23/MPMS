import { dbRepository } from '../utils/store.js';
import { sanitizeInput } from '../middleware/authMiddleware.js';

const VALID_STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

const calculateEstimatedCost = (serviceName, rooms, propertyType) => {
  let base = 6500;
  const s = String(serviceName).toLowerCase();
  if (s.includes('office')) base = 18500;
  else if (s.includes('intercity')) base = 15500;
  else if (s.includes('vehicle')) base = 9500;
  else if (s.includes('storage')) base = 4200;
  else if (s.includes('packing')) base = 3800;
  else if (s.includes('loading')) base = 2900;
  else if (s.includes('local')) base = 4800;

  const r = (rooms + ' ' + propertyType).toLowerCase();
  if (r.includes('4 bhk') || r.includes('villa')) base += 7200;
  else if (r.includes('3 bhk')) base += 4500;
  else if (r.includes('2 bhk')) base += 2400;
  else if (r.includes('corporate') || r.includes('office')) base += 9500;

  return base;
};

export const createBooking = async (req, res) => {
  try {
    const name = sanitizeInput(req.body.name);
    const email = sanitizeInput(req.body.email).toLowerCase();
    const mobile = sanitizeInput(req.body.mobile);
    const pickupAddress = sanitizeInput(req.body.pickupAddress);
    const dropAddress = sanitizeInput(req.body.dropAddress);
    const movingDate = sanitizeInput(req.body.movingDate);
    const propertyType = sanitizeInput(req.body.propertyType);
    const rooms = sanitizeInput(req.body.rooms);
    const service = sanitizeInput(req.body.service);
    const approximateItems = sanitizeInput(req.body.approximateItems);
    const message = sanitizeInput(req.body.message);

    if (
      !name ||
      !email ||
      !mobile ||
      !pickupAddress ||
      !dropAddress ||
      !movingDate ||
      !propertyType ||
      !rooms ||
      !service ||
      !approximateItems
    ) {
      return res.status(400).json({
        success: false,
        message: 'All mandatory quotation & booking fields must be filled.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10 || cleanMobile.length > 15) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.',
      });
    }

    const randomNum = Math.floor(1100 + Math.random() * 8899);
    const bookingId = `MPMS-2026-${randomNum}`;

    const estimatedCost =
      Number(req.body.estimatedCost) || calculateEstimatedCost(service, rooms, propertyType);
    const distanceKm = Number(req.body.distanceKm) || Math.floor(14 + Math.random() * 120);

    const newBooking = await dbRepository.createBooking({
      bookingId,
      name,
      email,
      mobile,
      pickupAddress,
      dropAddress,
      movingDate,
      propertyType,
      rooms,
      service,
      approximateItems,
      message,
      estimatedCost,
      distanceKm,
      status: 'Pending',
      remarks:
        'Booking request registered in MPMS. Our Move Coordinator will contact you shortly to confirm inventory & container slot.',
      assignedVehicle: service.toLowerCase().includes('vehicle')
        ? 'Enclosed Hydraulic Car Carrier'
        : 'Eicher 14ft Closed Container',
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully.',
      booking: newBooking,
    });
  } catch (err) {
    console.error('[Create Booking Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving booking in MongoDB.',
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const all = await dbRepository.getAllBookings();
    const { status, service, startDate, endDate, q, email } = req.query;

    let filtered = all;

    if (email && String(email).trim() !== '') {
      const targetEmail = String(email).trim().toLowerCase();
      filtered = filtered.filter((b) => b.email.toLowerCase() === targetEmail);
    }

    if (status && status !== 'All') {
      filtered = filtered.filter((b) => b.status.toLowerCase() === String(status).toLowerCase());
    }

    if (service && service !== 'All') {
      filtered = filtered.filter((b) => b.service.toLowerCase() === String(service).toLowerCase());
    }

    if (startDate) {
      const start = new Date(String(startDate)).getTime();
      if (!isNaN(start)) {
        filtered = filtered.filter((b) => new Date(b.movingDate).getTime() >= start);
      }
    }

    if (endDate) {
      const end = new Date(String(endDate)).getTime() + 86400000;
      if (!isNaN(end)) {
        filtered = filtered.filter((b) => new Date(b.movingDate).getTime() <= end);
      }
    }

    if (q && String(q).trim() !== '') {
      const keyword = String(q).trim().toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.bookingId.toLowerCase().includes(keyword) ||
          b.name.toLowerCase().includes(keyword) ||
          b.mobile.toLowerCase().includes(keyword) ||
          b.email.toLowerCase().includes(keyword) ||
          b.pickupAddress.toLowerCase().includes(keyword) ||
          b.dropAddress.toLowerCase().includes(keyword)
      );
    }

    return res.json({
      success: true,
      total: all.length,
      count: filtered.length,
      bookings: filtered,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings from MongoDB.',
    });
  }
};

export const searchBookings = async (req, res) => {
  return getBookings(req, res);
};

export const trackBookingPublic = async (req, res) => {
  try {
    const query = sanitizeInput(req.params.bookingId || req.query.q);
    if (!query) {
      return res.status(400).json({
        success: false,
        message:
          'Please enter a valid Booking ID (e.g., MPMS-2026-1042) or registered mobile number.',
      });
    }

    const byCode = await dbRepository.getBookingByIdOrCode(query);
    if (byCode) {
      return res.json({
        success: true,
        booking: byCode,
        bookings: [byCode],
      });
    }

    const all = await dbRepository.getAllBookings();
    const matches = all.filter(
      (b) =>
        b.mobile.replace(/\D/g, '').includes(query.replace(/\D/g, '')) &&
        query.replace(/\D/g, '').length >= 8
    );

    if (matches.length > 0) {
      return res.json({
        success: true,
        booking: matches[0],
        bookings: matches,
      });
    }

    return res.status(404).json({
      success: false,
      message: `No booking record found matching "${query}". Try sample ID: MPMS-2026-1042`,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Error looking up booking status.',
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await dbRepository.getBookingByIdOrCode(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found.',
      });
    }
    return res.json({
      success: true,
      booking,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking details.',
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const existing = await dbRepository.getBookingByIdOrCode(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found in MongoDB.',
      });
    }

    const updates = {};
    if (req.body.status && VALID_STATUSES.includes(req.body.status)) {
      updates.status = req.body.status;
    }
    if (req.body.remarks !== undefined) {
      updates.remarks = sanitizeInput(req.body.remarks);
    }
    if (req.body.assignedVehicle !== undefined) {
      updates.assignedVehicle = sanitizeInput(req.body.assignedVehicle);
    }
    if (req.body.estimatedCost !== undefined) {
      updates.estimatedCost = Number(req.body.estimatedCost);
    }
    if (req.body.movingDate !== undefined) {
      updates.movingDate = sanitizeInput(req.body.movingDate);
    }

    const updated = await dbRepository.updateBooking(existing._id, updates);
    return res.json({
      success: true,
      message: `Booking ${existing.bookingId} updated to "${updated?.status}" in MongoDB.`,
      booking: updated,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking record.',
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await dbRepository.deleteBooking(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found.',
      });
    }
    return res.json({
      success: true,
      message: 'Booking record deleted from MongoDB.',
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete booking.',
    });
  }
};
