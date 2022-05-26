const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route POST api/posts
// @desc Create a post
// @access Private
router.post(
  "/",
  auth,
  body("text", "Text is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET /api/posts
// @desc Get all posts
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/posts/:post_id
// @desc Get a post
// @access P
router.get("/:post_id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(400).json("Post doesn't exist");
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json("Post doesn't exist");
    }
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/posts/:post_id
// @desc Delete a post
// @access Private
router.delete("/:post_id", async (req, res) => {
  try {
    const post = await Post.findOneAndRemove({ _id: req.params.post_id });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/posts/like/:post_id
// @desc Like a post
// @access Private
router.put("/like/:post_id", auth, async (req, res) => {
  const { post_id } = req.params;

  try {
    let post = await Post.findById(post_id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/unlike/:post_id
// @desc Unlike a post
// @access Private
router.put("/unlike/:post_id", auth, async (req, res) => {
  const { post_id } = req.params;

  try {
    let post = await Post.findById(post_id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length <
      1
    ) {
      return res
        .status(400)
        .json({ msg: "Post has not been liked by the user" });
    }

    const newLikes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    post.likes = newLikes;

    await post.save();

    res.json(newLikes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/posts/comment/:post_id
// @desc Add comments to a post
// @access Private
router.post(
  "/comment/:post_id",
  auth,
  body("text", "Text is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.post_id);

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/posts/uncomment/:post_id/:comment_id
// @desc Uncomment a post
// @access Private
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    // await console.log(post);

    if (!post) {
      return res.status(404).json({ msg: "Post does not exist" });
    }

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exit" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "Unauthorized action" });
    }

    const newComment = post.comments.filter(
      (comment) => comment._id.toString() !== req.params.comment_id
    );

    post.comments = newComment;

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
