import bcrypt from 'bcryptjs';
import { dbRepository } from '../utils/store.js';
import { sanitizeInput, signToken } from '../middleware/authMiddleware.js';

export const login = async (req, res) => {
  try {
    const email = sanitizeInput(req.body.email).toLowerCase();
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const loginType = req.body.loginType || 'admin';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email address and password are required.',
      });
    }

    if (loginType === 'customer') {
      const user = await dbRepository.findUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({
          success: false,
          message: 'Invalid customer email or password.',
        });
      }
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({
          success: false,
          message: 'Invalid customer email or password.',
        });
      }
      const token = signToken({
        id: user._id,
        email: user.email,
        role: 'customer',
        name: user.name,
      });
      return res.json({
        success: true,
        message: 'Customer logged in successfully.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          city: user.city,
          address: user.address,
          role: 'customer',
        },
      });
    }

    // Admin login
    const admin = await dbRepository.findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
      });
    }

    const token = signToken({
      id: admin._id,
      email: admin.email,
      role: 'admin',
      name: admin.name,
    });

    return res.json({
      success: true,
      message: 'Administrator authenticated via JWT.',
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        designation: admin.designation,
      },
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

export const registerCustomer = async (req, res) => {
  try {
    const name = sanitizeInput(req.body.name);
    const email = sanitizeInput(req.body.email).toLowerCase();
    const mobile = sanitizeInput(req.body.mobile);
    const city = sanitizeInput(req.body.city) || 'Bengaluru';
    const address = sanitizeInput(req.body.address);
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, mobile number, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existing = await dbRepository.findUserByEmail(email);
    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    if (existing) {
      user = await dbRepository.updateUser(existing._id, {
        name,
        mobile,
        city,
        address: address || existing.address,
        passwordHash,
      });
    } else {
      user = await dbRepository.createUser({
        name,
        email,
        mobile,
        city,
        address,
        passwordHash,
        totalBookings: 0,
      });
    }

    if (!user) {
      return res.status(500).json({ success: false, message: 'Could not create user profile.' });
    }

    const token = signToken({
      id: user._id,
      email: user.email,
      role: 'customer',
      name: user.name,
    });

    return res.status(201).json({
      success: true,
      message: 'Customer account registered successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        city: user.city,
        address: user.address,
        role: 'customer',
      },
    });
  } catch (err) {
    console.error('[Customer Register Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while registering customer account.',
    });
  }
};

export const logout = async (_req, res) => {
  return res.json({
    success: true,
    message: 'Session terminated successfully.',
  });
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (req.user.role === 'admin') {
      const admin = await dbRepository.findAdminById(req.user.id);
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
      return res.json({
        success: true,
        profile: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          designation: admin.designation,
          updatedAt: admin.updatedAt,
        },
      });
    }

    const customer = await dbRepository.findUserById(req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      profile: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        city: customer.city,
        address: customer.address,
        role: 'customer',
      },
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const name = sanitizeInput(req.body.name);
    const email = sanitizeInput(req.body.email).toLowerCase();
    const phone = sanitizeInput(req.body.phone);
    const designation = sanitizeInput(req.body.designation);

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Administrator name and email are required.',
      });
    }

    const updated = await dbRepository.updateAdmin(req.user.id, {
      name,
      email,
      phone,
      designation,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Admin profile not found.' });
    }

    return res.json({
      success: true,
      message: 'Administrator profile updated in MongoDB.',
      admin: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        designation: updated.designation,
      },
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Error updating admin profile.' });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const admin = await dbRepository.findAdminById(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin record not found.' });
    }

    const isMatch = await bcrypt.compare(String(currentPassword), admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password entered is incorrect.',
      });
    }

    const newHash = await bcrypt.hash(String(newPassword), 10);
    await dbRepository.updateAdmin(admin._id, { passwordHash: newHash });

    return res.json({
      success: true,
      message: 'Password hashed with bcrypt and updated in MongoDB.',
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to update administrator password.',
    });
  }
};
