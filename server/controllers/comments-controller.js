import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

class CommentController {
  async getCommentsByPostId(req, res, next) {
    const postId = req.params.pid;
    let comments;
    try {
      comments = await Comment.find({ postId: postId });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a comments" });
    }

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "Could not find comments for the provided post id" });
    }

    res.status(200).json(comments);
  }

  async createComment(req, res, next) {
    // mb validation results

    // const { content, creatorId, postId } = req.body;
    const { content, postId } = req.body;

    console.log(req.userData.userId);

    if (req.userData.userId === undefined) {
      console.log("why");
    }

    let existingComment;
    try {
      existingComment = await Comment.findOne({
        creatorId: req.userData.userId,
        postId: postId,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Creating comment failed, please try again later",
        err,
      });
    }

    if (existingComment) {
      return res
        .status(422)
        .json({ message: "Comment by this user already exists" });
    }

    const newComment = new Comment({
      content,
      creatorId: req.userData.userId,
      postId,
      date: Date.now(),
    });

    let post;

    try {
      post = await Post.findById(postId);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Creating comment failed, please try again later" });
    }

    if (!post) {
      return res
        .status(404)
        .json({ message: "Could not find post for provided id" });
    }

    let user;
    try {
      user = await User.findById(req.userData.userId);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Creating comment failed, please try again later" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "Could not find user for provided id" });
    }

    try {
      await newComment.save();
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment.id },
      });
      // mb for User same..
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Creating comment failed, please try again later" });
    }

    res.status(201).json(newComment);
  }

  async deleteComment(req, res, next) {
    const commentId = req.params.cid;

    let comment;
    try {
      comment = await Comment.findById(commentId);

      if (!comment) {
        return res
          .status(404)
          .json({ message: "Could not find comment for this id" });
      }

      comment = await Comment.findByIdAndDelete(commentId);

      await Post.findByIdAndUpdate(comment.postId, {
        $pull: { comments: commentId },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a comment" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  }
}

export default new CommentController();
