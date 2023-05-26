import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";

import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import PostCreator from "../components/posts/PostCreator";
import PostLike from "../components/posts/PostLike";
import PostComments from "../components/posts/PostComments";

const PostPage = () => {
  const params = useParams();
  const [loadedPost, setLoadedPost] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/posts/${params.postId}`
        );
        setLoadedPost(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [sendRequest, params.postId]);

  // console.log(loadedPost);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedPost && (
        <div className="post">
          <h1>{loadedPost.title}</h1>
          <p>{loadedPost.content}</p>
          <PostCreator creatorId={loadedPost.creator} date={loadedPost.date} />
          <hr style={{ marginTop: 10 }} />
          <p>{loadedPost.content}</p>
          <hr style={{ marginBottom: 10 }} />
          <PostLike likes={loadedPost.likes} postId={loadedPost._id} />
          <PostComments
            postId={loadedPost._id}
            comments={loadedPost.comments}
          />
        </div>
      )}
    </>
  );
};

export default PostPage;
