import { dbRepository } from '../utils/store.js';
import { getMongoStatus } from '../config/db.js';

export const getDashboardStats = async (_req, res) => {
  try {
    const [services, users, enquiries, bookings, pages] = await Promise.all([
      dbRepository.getAllServices(),
      dbRepository.getAllUsers(),
      dbRepository.getAllEnquiries(),
      dbRepository.getAllBookings(),
      dbRepository.getAllPages(),
    ]);

    const totalServices = services.length;
    const activeServices = services.filter((s) => s.status === 'Active').length;
    const totalUsers = users.length;
    const totalEnquiries = enquiries.length;
    const unreadEnquiries = enquiries.filter((e) => e.readStatus === 'Unread').length;

    const totalBookings = bookings.length;
    const newBookings = bookings.filter((b) => b.status === 'Pending').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
    const inProgressBookings = bookings.filter((b) => b.status === 'In Progress').length;
    const completedBookings = bookings.filter((b) => b.status === 'Completed').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled').length;

    const totalEstimatedRevenue = bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((acc, b) => acc + (b.estimatedCost || 0), 0);

    const serviceMap = {};
    bookings.forEach((b) => {
      serviceMap[b.service] = (serviceMap[b.service] || 0) + 1;
    });
    const serviceBreakdown = Object.entries(serviceMap)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count);

    return res.json({
      success: true,
      stats: {
        totalServices,
        activeServices,
        totalUsers,
        totalEnquiries,
        unreadEnquiries,
        totalBookings,
        newBookings,
        confirmedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        totalEstimatedRevenue,
      },
      statusSummary: [
        { status: 'Pending', count: newBookings },
        { status: 'Confirmed', count: confirmedBookings },
        { status: 'In Progress', count: inProgressBookings },
        { status: 'Completed', count: completedBookings },
        { status: 'Cancelled', count: cancelledBookings },
      ],
      serviceBreakdown,
      recentBookings: bookings.slice(0, 6),
      recentEnquiries: enquiries.slice(0, 5),
      mongoStatus: {
        ...getMongoStatus(),
        documentCounts: {
          services: totalServices,
          bookings: totalBookings,
          enquiries: totalEnquiries,
          users: totalUsers,
          pages: pages.length,
          admins: 1,
        },
      },
    });
  } catch (err) {
    console.error('[Dashboard Stats Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to aggregate dashboard statistics from MongoDB.',
    });
  }
};

export const getMongoCollectionsSnapshot = async (_req, res) => {
  try {
    const [services, users, enquiries, bookings, pages] = await Promise.all([
      dbRepository.getAllServices(),
      dbRepository.getAllUsers(),
      dbRepository.getAllEnquiries(),
      dbRepository.getAllBookings(),
      dbRepository.getAllPages(),
    ]);

    return res.json({
      success: true,
      mongoInfo: getMongoStatus(),
      collections: {
        services,
        bookings,
        enquiries,
        users: users.map(({ passwordHash, ...rest }) => rest),
        pages,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to inspect MongoDB collections.',
    });
  }
};
