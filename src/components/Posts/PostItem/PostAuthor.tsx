import React from "react";
import { useNavigate } from "react-router-dom";
import { defaultAvatarImage } from "./constants";
import useRequest from "../../../hooks/useRequest";
import { PostCreator } from "../../../types";
import Avatar from "../../UI/Avatar/Avatar";
// import Loading from "../../UI/Loading/Loading";

interface Props {
  creator: string;
}

const PostAuthor = ({ creator }: Props): React.ReactElement => {
  const navigate = useNavigate();
  const [postCreator, isLoading, error] = useRequest<PostCreator>({
    method: "GET",
    url: `${import.meta.env.VITE_API_URL}/users/${creator}`,
  });

  const postCreatorImage = isLoading
    ? defaultAvatarImage
    : postCreator?.image
    ? import.meta.env.VITE_APP_URL + postCreator?.image
    : defaultAvatarImage;

  const authorUsername = isLoading ? "author" : postCreator?.username;

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      className="post__creator"
      onClick={() => navigate(`/${postCreator?.userId}/posts`)}
    >
      <Avatar
        image={postCreatorImage}
        alt="author-avatar"
        width="2rem"
        height="2rem"
        username={authorUsername}
      />
    </div>
  );
};

export default PostAuthor;
