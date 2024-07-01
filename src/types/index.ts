type ObjectId = string;

export type Likes = {
  [key: ObjectId]: boolean;
};

export type Post = {
  _id: ObjectId;
  title: string;
  rubric: string;
  content: string;
  description: string;
  creator: ObjectId;
  likes: Likes;
  comments: ObjectId[];
  date: string;
  image: string;
};

export type PostCreator = {
  userId: ObjectId;
  username: string;
  posts: string[];
  image: string;
};
