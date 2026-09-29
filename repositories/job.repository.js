const Job = require('../models/Job');

module.exports = {
  create: (data) => Job.create(data),
  findById: (id) => Job.findById(id).populate('employer', 'companyName location'),
  findByEmployer: (employerId) => Job.find({ employer: employerId }).sort({ createdAt: -1 }),
  updateById: (id, data) => Job.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  deleteById: (id) => Job.findByIdAndDelete(id),
};