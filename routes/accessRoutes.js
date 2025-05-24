const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Member = require('../models/Member');

router.get('/', (req, res) => res.redirect('/signin'));
router.get('/register', (req, res) => res.render('register'));
router.get('/signin', (req, res) => res.render('signin'));
router.get('/home', (req, res) => res.render('home'));

router.post('/register', async (req, res) => {
  const { fullname, emailAddress, secretCode } = req.body;
  try {
    let existing = await Member.findOne({ emailAddress });
    if (existing) return res.send("Member already registered.");

    const hashed = await bcrypt.hash(secretCode, 10);
    const newMember = new Member({ fullname, emailAddress, secretCode: hashed });
    await newMember.save();

    res.send("Registration complete. <a href='/signin'>Sign In</a>");
  } catch (err) {
    res.send("Registration error.");
  }
});

router.post('/signin', async (req, res) => {
  const { emailAddress, secretCode } = req.body;
  try {
    const member = await Member.findOne({ emailAddress });
    if (!member) return res.send("Invalid credentials");

    const match = await bcrypt.compare(secretCode, member.secretCode);
    if (!match) return res.send("Invalid credentials");

    const token = jwt.sign({ id: member._id }, 'secureKey', { expiresIn: '1h' });
    res.send("Sign in successful. <a href='/home'>Go to Home</a>");
  } catch (err) {
    res.send("Sign in error.");
  }
});

module.exports = router;
