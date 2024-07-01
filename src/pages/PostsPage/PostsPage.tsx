import { useState } from "react";
import useRequest from "../../hooks/useRequest";

import { Post } from "../../types/index";

import { defaultNumberOfPosts } from "./constants";

import PostsList from "../../components/Posts/PostList/PostsList/PostsList";
import PostListSleleton from "../../components/Posts/PostList/PostsListSkeleton/PostListSleleton";

interface Response {
  posts: Post[];
  likesCount: number;
}

interface Props {
  rubric: string;
}

const PostsPage = ({ rubric }: Props) => {
  const [page, setPage] = useState<number>(0);
  const [posts, isLoading, error, request] = useRequest<Response>({
    method: "GET",
    url: `${
      import.meta.env.VITE_API_URL
    }/posts/${rubric}?limit=${defaultNumberOfPosts}`,
  });

  if (isLoading) {
    return <PostListSleleton itemsNumber={defaultNumberOfPosts} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h2 className="posts__page__title">&#9632; {posts?.posts[0].rubric}</h2>
      <PostsList posts={posts?.posts} />
    </>
  );
};

export default PostsPage;
