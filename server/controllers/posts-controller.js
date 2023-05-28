import Post from "../models/Post.js";
import User from "../models/User.js";

class PostController {
  async getPosts(req, res, next) {
    const { limit, page } = req.query;
    const userId = req.params.uid;

    // console.log(req._parsedUrl.pathname);

    const pageSize = limit ? parseInt(limit) : 0;
    const pageNumber = page ? parseInt(page) : 0;

    try {
      // const users = await User.find({}, "-password");
      let posts;
      let totalCount;
      if (req._parsedUrl.pathname === "/") {
        console.log("all posts");
        posts = await Post.find()
          // .sort({ date: -1 })
          .limit(pageSize)
          .skip(pageSize * pageNumber);

        totalCount = await Post.countDocuments();
      } else if (req._parsedUrl.pathname === `/user/${userId}`) {
        console.log("User posts");
        posts = await Post.find({ creator: userId })
          // .sort({ date: -1 })
          .limit(pageSize)
          .skip(pageSize * pageNumber);

        totalCount = await Post.countDocuments({ creator: userId });
      }

      // const totalCount = await Post.countDocuments();
      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", totalCount);

      res.status(200).json(posts);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // async getPostsByUserId(req, res, next) {
  //   const { limit, page } = req.query;
  //   const userId = req.params.uid;

  //   // console.log(req._parsedUrl.pathname);

  //   const pageSize = limit ? parseInt(limit) : 0;
  //   const pageNumber = page ? parseInt(page) : 0;

  //   try {
  //     // const users = await User.find({}, "-password");

  //     console.log("User posts");
  //     const posts = await Post.find({ creator: userId })
  //       // .sort({ date: -1 })
  //       .limit(pageSize)
  //       .skip(pageSize * pageNumber);

  //     const totalCount = await Post.countDocuments();
  //     res.header("Access-Control-Expose-Headers", "X-Total-Count");
  //     res.header("X-Total-Count", totalCount);

  //     res.status(200).json(posts);
  //   } catch (err) {
  //     res.status(404).json({ message: err.message });
  //   }
  // }

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
    const { title, rubric, description, content } = req.body;

    const newPost = new Post({
      title,
      rubric,
      description,
      content,
      creator: req.userData.userId,
      //   creator: req.userData.userId,
      comments: [],
      likes: {},
      date: Date.now(),
    });

    let user;
    try {
      user = await User.findById(req.userData.userId);
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
      await User.findByIdAndUpdate(req.userData.userId, {
        $push: { posts: newPost.id },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Creating post failed, please try again later", err });
    }

    res.status(201).json(newPost);
  }

  async updatePost(req, res, next) {
    const { title, rubric, description, content } = req.body;
    const postId = req.params.pid;

    let post;
    try {
      post = await Post.findById(postId);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a post", err });
    }

    // if not convert to stirng. there`ll mongoose object id type, not string what we needed
    if (post.creator.toString() !== req.userData.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this post" });
    }

    post.title = title;
    post.rubric = rubric;
    post.description = description;
    post.content = content;

    try {
      await post.save();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could update a post", err });
    }

    res.status(200).json(post);
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
