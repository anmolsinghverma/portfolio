require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

(async () => {
  await mongoose.connect(env.mongoUri);
  await Promise.all([Profile.deleteMany(), Project.deleteMany(), Skill.deleteMany()]);

  await Profile.create({
    name: 'Your Name',
    title: 'Full-stack developer',
    bio: 'I build web applications from the database to the browser. Replace this text with two or three sentences about what you make and what you are looking for.',
    location: 'Greater Noida, India',
    email: 'you@example.com',
    socials: { github: 'https://github.com/', linkedin: 'https://www.linkedin.com/' },
  });

  await Project.insertMany([
    { title: 'Campus Notes', summary: 'Shared lecture notes with search and tagging for a class of 120 students.', stack: ['Node.js', 'Express', 'MongoDB'], repoUrl: 'https://github.com/', year: 2026, order: 1 },
    { title: 'Health Record Manager', summary: 'Role-based patient record system built as a group project.', stack: ['JavaScript', 'REST', 'MongoDB'], repoUrl: 'https://github.com/', year: 2026, order: 2 },
    { title: 'Expense Tracker', summary: 'Mobile-first budgeting app with monthly charts.', stack: ['HTML', 'CSS', 'JavaScript'], liveUrl: 'https://example.com', year: 2025, order: 3 },
  ]);

  await Skill.insertMany([
    { name: 'JavaScript', category: 'Frontend', level: 5 },
    { name: 'HTML & CSS', category: 'Frontend', level: 5 },
    { name: 'Node.js', category: 'Backend', level: 4 },
    { name: 'Express', category: 'Backend', level: 4 },
    { name: 'REST API design', category: 'Backend', level: 4 },
    { name: 'MongoDB', category: 'Data', level: 4 },
    { name: 'Mongoose', category: 'Data', level: 4 },
    { name: 'Git', category: 'Tooling', level: 4 },
    { name: 'Docker', category: 'Tooling', level: 3 },
  ]);

  console.log('Seeded profile, projects and skills.');
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
