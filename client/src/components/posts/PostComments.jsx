import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "../../hooks/form-hook";
import { AuthContext } from "../../context/auth-context";
import { VALIDATOR_REQUIRE } from "../../utils/validators";

import Input from "../UI/input/Input";
import Button from "../UI/Button/Button";

import "./PostComments.css";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import CommentsList from "./comments/CommentsList";
import CommentItem from "./comments/CommentItem";

const PostComments = ({ postId, comments }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadedComments, setLoadedComments] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      content: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const deleteCommentHandler = (deletedCommentId) => {
    setLoadedComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== deletedCommentId)
    );
  };

  const fetchComments = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/comments/post/${postId}`
      );

      setLoadedComments(responseData.reverse());
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    console.log("refresh comments");

    fetchComments();
  }, [sendRequest, fetchComments]);

  const commentSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // const formData = new FormData();
      // formData.append("content", formState.inputs.content.value);
      // formData.append("postId", postId);

      // console.log(formData.getAll);

      await fetch(`http://localhost:5000/api/comments`, {
        method: "POST",
        body: JSON.stringify({
          content: formState.inputs.content.value,
          postId: postId,
          // creatorId: auth.userId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        // body: formData,
      });

      fetchComments();

      // setLoadedComments([
      //   ...loadedComments,
      //   {
      //     _id: Math.floor(Math.random() * 1000),
      //     content: formState.inputs.content.value,
      //     creatorId: auth.userId,
      //     postId: postId,
      //     date: Date.now(),
      //   },
      // ]);

      // setFormData(
      //   {
      //     content: {
      //       value: "",
      //       isValid: false,
      //     },
      //   },
      //   false
      // );
    } catch (err) {
      console.log(err);
    }
  };

  let commentCreatedByUser;

  loadedComments &&
    loadedComments.map((comment) => {
      if (auth.userId === comment.creatorId) {
        commentCreatedByUser = comment.creatorId;
      }
    });

  // console.log(
  //   loadedComments &&
  //     loadedComments.sort((a, b) => a[date].localeCompare(b[date]))
  // );
  // console.log(loadedComments.reverse());

  // useEffect(() => {
  //   // setFormData(
  //   //   {
  //   //     content: {
  //   //       value: "",
  //   //       isValid: false,
  //   //     },
  //   //   },
  //   //   false
  //   // );
  // }, [commentSubmitHandler]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {auth.isLoggedIn ? (
        commentCreatedByUser ? (
          <CommentsList
            items={loadedComments.filter(
              (comment) => comment.creatorId === commentCreatedByUser
            )}
            userCommentExist
            deleteCommentHandler={deleteCommentHandler}
          />
        ) : (
          <form
            className="place-form user__comment"
            onSubmit={commentSubmitHandler}
          >
            <Input
              id="content"
              element="textarea"
              placeholder="Напишіть свою думку..."
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              withoutErrors
            />
            <Button
              label="Додати коментар"
              type="submit"
              disabled={!formState.isValid}
            />
          </form>
        )
      ) : (
        <div className="comment__center place-form">
          <p>Щоб залишати коментарі треба увійти у свій акаунт</p>
          <Button label="Увійти" onClick={() => navigate("/login")} />
        </div>
      )}
      {/* {isLoading && <LoadingSpinner />} */}
      {!isLoading && loadedComments && (
        <CommentsList
          items={loadedComments.filter(
            (comment) => comment.creatorId !== commentCreatedByUser
          )}
        />
      )}
    </>
  );
};

export default PostComments;
