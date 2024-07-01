import useRequest from "../../hooks/useRequest";
import { Post } from "../../types/index";
import PostsList from "./PostList/PostsList";
import PostListSleleton from "./PostList/PostListSleleton";

interface Response {
  posts: Post[];
  likesCount: number;
}

const PostsPage = () => {
  const [posts, isLoading, error] = useRequest<Response>({
    method: "GET",
    url: `${import.meta.env.VITE_API_URL}/posts`,
  });

  if (isLoading) {
    return <PostListSleleton itemsNumber={4} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <PostsList posts={posts?.posts} />
    </>
  );
};

export default PostsPage;
