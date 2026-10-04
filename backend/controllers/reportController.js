import { dbRepository } from '../utils/store.js';

export const getBookingReport = async (req, res) => {
  try {
    const allBookings = await dbRepository.getAllBookings();
    const { startDate, endDate, status, service, q } = req.query;

    let filtered = [...allBookings];

    if (status && status !== 'All') {
      filtered = filtered.filter((b) => b.status.toLowerCase() === String(status).toLowerCase());
    }

    if (service && service !== 'All') {
      filtered = filtered.filter((b) => b.service.toLowerCase() === String(service).toLowerCase());
    }

    if (startDate && String(startDate).trim() !== '') {
      const start = new Date(String(startDate)).getTime();
      if (!isNaN(start)) {
        filtered = filtered.filter((b) => new Date(b.movingDate).getTime() >= start);
      }
    }

    if (endDate && String(endDate).trim() !== '') {
      const end = new Date(String(endDate)).getTime() + 86400000;
      if (!isNaN(end)) {
        filtered = filtered.filter((b) => new Date(b.movingDate).getTime() <= end);
      }
    }

    if (q && String(q).trim() !== '') {
      const kw = String(q).trim().toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.bookingId.toLowerCase().includes(kw) ||
          b.name.toLowerCase().includes(kw) ||
          b.mobile.toLowerCase().includes(kw) ||
          b.service.toLowerCase().includes(kw) ||
          b.pickupAddress.toLowerCase().includes(kw) ||
          b.dropAddress.toLowerCase().includes(kw)
      );
    }

    const summary = {
      totalRecords: allBookings.length,
      filteredRecords: filtered.length,
      pendingCount: filtered.filter((b) => b.status === 'Pending').length,
      confirmedCount: filtered.filter((b) => b.status === 'Confirmed').length,
      inProgressCount: filtered.filter((b) => b.status === 'In Progress').length,
      completedCount: filtered.filter((b) => b.status === 'Completed').length,
      cancelledCount: filtered.filter((b) => b.status === 'Cancelled').length,
      totalEstimatedValue: filtered
        .filter((b) => b.status !== 'Cancelled')
        .reduce((sum, b) => sum + (b.estimatedCost || 0), 0),
    };

    const serviceWiseMap = {};
    filtered.forEach((b) => {
      if (!serviceWiseMap[b.service]) {
        serviceWiseMap[b.service] = { count: 0, value: 0 };
      }
      serviceWiseMap[b.service].count += 1;
      if (b.status !== 'Cancelled') {
        serviceWiseMap[b.service].value += b.estimatedCost || 0;
      }
    });

    const serviceWiseBreakdown = Object.entries(serviceWiseMap).map(([serviceName, data]) => ({
      service: serviceName,
      count: data.count,
      value: data.value,
    }));

    return res.json({
      success: true,
      summary,
      serviceWiseBreakdown,
      records: filtered,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate booking report.',
    });
  }
};

export const getEnquiryReport = async (req, res) => {
  try {
    const allEnquiries = await dbRepository.getAllEnquiries();
    const { startDate, endDate, readStatus, q } = req.query;

    let filtered = [...allEnquiries];

    if (readStatus && readStatus !== 'All') {
      filtered = filtered.filter(
        (e) => e.readStatus.toLowerCase() === String(readStatus).toLowerCase()
      );
    }

    if (startDate && String(startDate).trim() !== '') {
      const start = new Date(String(startDate)).getTime();
      if (!isNaN(start)) {
        filtered = filtered.filter((e) => new Date(e.createdAt).getTime() >= start);
      }
    }

    if (endDate && String(endDate).trim() !== '') {
      const end = new Date(String(endDate)).getTime() + 86400000;
      if (!isNaN(end)) {
        filtered = filtered.filter((e) => new Date(e.createdAt).getTime() <= end);
      }
    }

    if (q && String(q).trim() !== '') {
      const kw = String(q).trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.enquiryId.toLowerCase().includes(kw) ||
          e.name.toLowerCase().includes(kw) ||
          e.email.toLowerCase().includes(kw) ||
          e.mobile.toLowerCase().includes(kw) ||
          e.subject.toLowerCase().includes(kw)
      );
    }

    const summary = {
      totalRecords: allEnquiries.length,
      filteredRecords: filtered.length,
      unreadCount: filtered.filter((e) => e.readStatus === 'Unread').length,
      readCount: filtered.filter((e) => e.readStatus === 'Read').length,
      repliedWithRemarksCount: filtered.filter((e) => Boolean(e.remarks && e.remarks.trim())).length,
    };

    return res.json({
      success: true,
      summary,
      records: filtered,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate enquiry report.',
    });
  }
};
