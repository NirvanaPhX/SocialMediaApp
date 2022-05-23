const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// @route POST api/users
// @desc Register user
// @access Public
router.post(
  "/",
  body("name").not().isEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
  }
);

module.exports = router;
