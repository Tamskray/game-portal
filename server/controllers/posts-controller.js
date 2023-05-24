import Post from "../models/Post.js";
import User from "../models/User.js";

class PostController {
  async getPosts(req, res, next) {
    try {
      // const users = await User.find({}, "-password");
      const posts = await Post.find();

      res.status(200).json(posts);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  async getPostById(req, res, next) {
    const postId = req.params.pid;
    let post;
    try {
      post = await Post.findById(postId);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a post" });
    }

    if (!post) {
      return res
        .status(404)
        .json({ message: "Could not find post for provided id" });
    }

    res.json(post);
  }

  async createPost(req, res, next) {
    // express validation results
    // ---------

    // creator will be removed in future on client
    const { title, rubric, content, creator } = req.body;

    const newPost = new Post({
      title,
      rubric,
      content,
      creator,
      //   creator: req.userData.userId,
      comments: [],
      likes: {},
      date: Date.now(),
    });

    let user;
    try {
      user = await User.findById(creator);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Creating post failed, please try again later" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "Could not find user for provided id" });
    }

    try {
      await newPost.save();
      await User.findByIdAndUpdate(creator, { $push: { posts: newPost.id } });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Creating post failed, please try again later", err });
    }

    res.status(201).json(newPost);
  }

  async updatePostLike(req, res, next) {
    const postId = req.params.pid;
    const { userId } = req.body;

    let post;
    try {
      post = await Post.findById(postId);

      if (!post) {
        return res
          .status(404)
          .json({ message: "Could not find post for this id" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a post" });
    }

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    try {
      await Post.findByIdAndUpdate(postId, { likes: post.likes });
    } catch (err) {
      return res.status(500).json({
        message: "Updating post likes failed, please try again later",
        err,
      });
    }

    // update post info for json output
    post = await Post.findById(postId);

    res.status(200).json({ likes: post.likes });
  }

  async deletePost(req, res, next) {
    const postId = req.params.pid;

    let post;
    try {
      post = await Post.findById(postId);

      if (!post) {
        return res
          .status(404)
          .json({ message: "Could not find post for this id" });
      }

      post = await Post.findByIdAndDelete(postId);

      await User.findByIdAndUpdate(post.creator, { $pull: { posts: postId } });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a post" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  }
}

export default new PostController();
