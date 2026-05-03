import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const normalizeRole = (value) => {
      if (!value) return null;
      const lower = String(value).trim().toLowerCase();
      if (lower === 'admin') return 'Admin';
      if (lower === 'member') return 'Member';
      return null;
    };

    const selectedRole = normalizeRole(role);

    if (!selectedRole) {
      return res.status(400).json({ message: 'Please select a valid role to login' });
    }

    const user = await User.findOne({ email });
    const userRole = normalizeRole(user?.role);

    if (user && (await user.matchPassword(password))) {
      if (userRole !== selectedRole) {
        return res.status(401).json({ message: `This account is not registered as ${selectedRole}` });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userRole || user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const normalizeRole = (value) => {
      const lower = String(value || 'member').trim().toLowerCase();
      return lower === 'admin' ? 'Admin' : 'Member';
    };

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const requestedRole = normalizeRole(role);

    // Public signup can only create Member accounts.
    if (requestedRole === 'Admin') {
      return res.status(403).json({ message: 'Admin account creation is restricted. Please contact an existing admin.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'Member',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
