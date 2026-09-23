const User = require('../models/User');

module.exports = {
  findById: (id) => User.findById(id),
  findByEmail: (email) => User.findOne({ email: String(email).toLowerCase().trim() }),
  findByUsername: (username) => User.findOne({ username: String(username).trim() }),
  findByEmailOrUsername: (identifier) => {
    const value = String(identifier).trim();
    return User.findOne({
      $or: [{ email: value.toLowerCase() }, { username: value }],
    });
  },
  create: (data) => User.create(data),
  countByRole: (role) => User.countDocuments({ role }),
};