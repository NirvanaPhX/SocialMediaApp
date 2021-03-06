const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const config = require("config");
const request = require("request");

const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

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
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/profile/experience
// @desc Add profile experience
// @access Private
router.put(
  "/experience",
  auth,
  body("title", "Title is required").not().isEmpty(),
  body("company", "Company is required").not().isEmpty(),
  body("location", "Location is required").not().isEmpty(),
  body("from", "From date is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(500).json({ msg: "User profile doesn't exist" });
      }

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete profile experience
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  const { exp_id } = req.params;
  console.log(exp_id);

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const newExp = await profile.experience.filter((exp) => exp._id != exp_id);
    await console.log(newExp);

    profile.experience = newExp;

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route api/profile/education
// @desc Add education
// @access Private
router.put(
  "/education",
  auth,
  body("school", "School is required").not().isEmpty(),
  body("degree", "Degree is required").not().isEmpty(),
  body("fieldofstudy", "Field of Study is required").not().isEmpty(),
  body("from", "From date is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEducation);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE /api/profile/education/:education_id
// @desc Delete an eduction
// @access Private
router.delete("/education/:education_id", auth, async (req, res) => {
  try {
    const { education_id } = req.params;
    const profile = await Profile.findOne({ user: req.user.id });

    const newEducation = await profile.education.filter(
      (edu) => edu._id != education_id
    );

    profile.education = newEducation;

    await profile.save();

    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/profile/github/:githubusername
// @desc Get github repo
// @access Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientID"
      )}&client_secret=${config.get("githubClientSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, resp, body) => {
      if (error) console.error(error);

      if (resp.statusCode !== 200) {
        console.log(resp);
        return res.status(400).json({ msg: "No Github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
