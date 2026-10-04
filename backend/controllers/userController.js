import { dbRepository } from '../utils/store.js';

export const getUsers = async (req, res) => {
  try {
    const users = await dbRepository.getAllUsers();
    const bookings = await dbRepository.getAllBookings();
    const q = req.query.q ? String(req.query.q).trim().toLowerCase() : '';

    const enrichedUsers = users.map((u) => {
      const userBookings = bookings.filter(
        (b) => b.email.toLowerCase() === u.email.toLowerCase() || b.userId === u._id
      );
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        city: u.city,
        address: u.address,
        totalBookings: userBookings.length,
        totalSpend: userBookings
          .filter((b) => b.status !== 'Cancelled')
          .reduce((sum, b) => sum + (b.estimatedCost || 0), 0),
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    });

    const filtered = q
      ? enrichedUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.mobile.toLowerCase().includes(q) ||
            u.city.toLowerCase().includes(q)
        )
      : enrichedUsers;

    return res.json({
      success: true,
      total: enrichedUsers.length,
      count: filtered.length,
      users: filtered,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users from MongoDB.',
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await dbRepository.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User record not found.',
      });
    }

    const allBookings = await dbRepository.getAllBookings();
    const bookingHistory = allBookings.filter(
      (b) => b.email.toLowerCase() === user.email.toLowerCase() || b.userId === user._id
    );

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        city: user.city,
        address: user.address,
        totalBookings: bookingHistory.length,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      bookingHistory,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user details.',
    });
  }
};
