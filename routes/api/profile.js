const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const { route } = require("./users");

// @route /api/profile/me
// @desc Get logged in user profile
// @access Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "This user doesn't have a profile yet" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route /api/profile
// @desc Create or update user profile
// @access Private
router.post(
  "/",
  auth,
  body("status", "Status is required").not().isEmpty(),
  body("skills", "Skills is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    let profileFields = {};
    profileFields.user = req.user.id;

    if (company) {
      profileFields.company = company;
    }
    if (website) {
      profileFields.website = website;
    }
    if (location) {
      profileFields.location = location;
    }
    if (status) {
      profileFields.status = status;
    }
    if (bio) {
      profileFields.bio = bio;
    }
    if (githubusername) {
      profileFields.githubusername = githubusername;
    }
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) {
      profileFields.social.youtube = youtube;
    }
    if (facebook) {
      profileFields.social.facebook = facebook;
    }
    if (twitter) {
      profileFields.social.twitter = twitter;
    }
    if (instagram) {
      profileFields.social.instagram = instagram;
    }
    if (linkedin) {
      profileFields.social.linkedin = linkedin;
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // Update profile if it exists
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create new profile it doesn't exist
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET /api/profile
// @desc Get all the profiles
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate("user", [
      "name",
      "avatar",
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public
router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const profile = await Profile.findOne({ user: user_id }).populate("user", [
      "name",
      "avatar",
    ]);

    if (!profile) {
      return res.status(400).send({ msg: "User profile does not exist" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    // Show same error message if object Id is incorrect
    if ((err.kind = "ObjectId")) {
      return res.status(400).send({ msg: "User profile does not exist" });
    }

    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/profile
// @desc Delete profile, user & posts
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
