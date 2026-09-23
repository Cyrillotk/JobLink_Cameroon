const ROLES = {
  EMPLOYER: 'employer',
  JOBSEEKER: 'jobseeker',
  ADMIN: 'admin',
};

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Volunteer'];

const JOB_STATUS = ['active', 'closed'];

const APPLICATION_STATUS = ['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'];

const LOCATIONS = [
  'Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Limbe', 'Kumba',
  'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Remote',
];

module.exports = { ROLES, JOB_TYPES, JOB_STATUS, APPLICATION_STATUS, LOCATIONS };