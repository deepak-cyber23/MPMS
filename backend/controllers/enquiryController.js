import { dbRepository } from '../utils/store.js';
import { sanitizeInput } from '../middleware/authMiddleware.js';

export const createEnquiry = async (req, res) => {
  try {
    const name = sanitizeInput(req.body.name);
    const email = sanitizeInput(req.body.email).toLowerCase();
    const mobile = sanitizeInput(req.body.mobile);
    const subject = sanitizeInput(req.body.subject);
    const message = sanitizeInput(req.body.message);

    if (!name || !email || !mobile || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All enquiry fields (Name, Email, Mobile, Subject, Message) are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10 || cleanMobile.length > 15) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    const enquiryId = `ENQ-2026-${Math.floor(510 + Math.random() * 489)}`;

    const created = await dbRepository.createEnquiry({
      enquiryId,
      name,
      email,
      mobile,
      subject,
      message,
      readStatus: 'Unread',
      remarks: '',
    });

    return res.status(201).json({
      success: true,
      message: `Your enquiry (${enquiryId}) has been recorded in MongoDB. Our support desk will respond within 2 business hours.`,
      enquiry: created,
    });
  } catch (err) {
    console.error('[Create Enquiry Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving enquiry in MongoDB.',
    });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const all = await dbRepository.getAllEnquiries();
    const { readStatus, startDate, endDate, q } = req.query;

    let filtered = all;

    if (readStatus && readStatus !== 'All') {
      filtered = filtered.filter(
        (e) => e.readStatus.toLowerCase() === String(readStatus).toLowerCase()
      );
    }

    if (startDate) {
      const start = new Date(String(startDate)).getTime();
      if (!isNaN(start)) {
        filtered = filtered.filter((e) => new Date(e.createdAt).getTime() >= start);
      }
    }

    if (endDate) {
      const end = new Date(String(endDate)).getTime() + 86400000;
      if (!isNaN(end)) {
        filtered = filtered.filter((e) => new Date(e.createdAt).getTime() <= end);
      }
    }

    if (q && String(q).trim() !== '') {
      const keyword = String(q).trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.enquiryId.toLowerCase().includes(keyword) ||
          e.name.toLowerCase().includes(keyword) ||
          e.email.toLowerCase().includes(keyword) ||
          e.mobile.toLowerCase().includes(keyword) ||
          e.subject.toLowerCase().includes(keyword) ||
          e.message.toLowerCase().includes(keyword)
      );
    }

    return res.json({
      success: true,
      total: all.length,
      count: filtered.length,
      enquiries: filtered,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve enquiries.',
    });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await dbRepository.getEnquiryById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry record not found.',
      });
    }
    return res.json({
      success: true,
      enquiry,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to load enquiry details.',
    });
  }
};

export const updateEnquiry = async (req, res) => {
  try {
    const existing = await dbRepository.getEnquiryById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }

    const updates = {};
    if (req.body.readStatus === 'Read' || req.body.readStatus === 'Unread') {
      updates.readStatus = req.body.readStatus;
    }
    if (req.body.remarks !== undefined) {
      updates.remarks = sanitizeInput(req.body.remarks);
    }

    const updated = await dbRepository.updateEnquiry(existing._id, updates);
    return res.json({
      success: true,
      message: 'Enquiry updated in MongoDB.',
      enquiry: updated,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to update enquiry.',
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const deleted = await dbRepository.deleteEnquiry(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }
    return res.json({
      success: true,
      message: 'Enquiry deleted from MongoDB.',
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry.',
    });
  }
};
