const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Sign up

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('lastname')
    .not()
    .isEmail()
    .withMessage('Must provide a last name'),
  check('firstName')
    .exists({checkFalsy: true})
    .withMessage('Must provide a first name'),
  check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const sameEmail = await User.findOne({
      where:{
        email
      }
    });
    if (sameEmail) {
      res.status(403);
      res.json({
        "message": "User already exists",
        "statusCode": 403,
        "errors": [
          "User with that email already exists"
        ]
      })
    };

    const sameUserName = await User.findOne({
      where:{
        username
      }
    })
    if (sameUserName) {
      res.status(403);
      res.json({
        "message": "User already exists",
        "statusCode": 403,
        "errors": [
          "User with that username already exists"
        ]
      })
    }
    const user = await User.signup({ email, username, password, firstName, lastName });

    await setTokenCookie(res, user);

    return res.json({
      user: user
    });
  }
);

module.exports = router;
