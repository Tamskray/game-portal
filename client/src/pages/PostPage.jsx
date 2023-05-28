import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";

import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import PostCreator from "../components/posts/PostCreator";
import PostLike from "../components/posts/PostLike";
import PostComments from "../components/posts/PostComments";

import { convertToRaw, EditorState, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
// import "draft-js/dist/Draft.css";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import cl from "../styles/PostPage.module.css";

const PostPage = () => {
  const params = useParams();
  const [loadedPost, setLoadedPost] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createEmpty()
  // );

  // const [contentState, setContentState] = useState();
  // let raw;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/posts/${params.postId}`
        );
        setLoadedPost(responseData);
        // console.log(responseData.content);

        // const contentBlock = htmlToDraft(responseData.content);
        // const contentState = ContentState.createFromBlockArray(
        //   contentBlock.contentBlocks
        // );
        // const editorState = EditorState.createWithContent(contentState);

        // setEditorState(editorState);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [sendRequest, params.postId]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedPost && (
        <div className="post">
          <h1>{loadedPost.title}</h1>
          <p>{loadedPost.description}</p>
          <PostCreator creatorId={loadedPost.creator} date={loadedPost.date} />
          <hr style={{ marginTop: 10 }} />

          <div
            className={cl.post__content}
            dangerouslySetInnerHTML={{ __html: loadedPost.content }}
          >
            {/* <p>{loadedPost.content}</p> */}
          </div>
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
