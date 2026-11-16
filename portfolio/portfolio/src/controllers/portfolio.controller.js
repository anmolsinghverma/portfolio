const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const { asyncHandler } = require('../middleware/error');

exports.getProfile = asyncHandler(async (req, res) => {
  const data = await Profile.findOne().lean();
  if (!data) return res.status(404).json({ success: false, errors: [{ message: 'Profile not set up. Run npm run seed.' }] });
  res.json({ success: true, data });
});

exports.getProjects = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await Project.find().sort({ order: 1 }).lean() });
});

exports.getSkills = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await Skill.find().sort({ category: 1, level: -1 }).lean() });
});
