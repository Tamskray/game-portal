import React, { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/comments/post/${postId}`
        );

        setLoadedComments(responseData);

        console.log(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, [sendRequest]);

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

      setLoadedComments([
        ...loadedComments,
        {
          _id: Math.floor(Math.random() * 1000),
          content: formState.inputs.content.value,
          creatorId: auth.userId,
          postId: postId,
          date: Date.now(),
        },
      ]);

      setFormData(
        {
          content: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // setFormData(
    //   {
    //     content: {
    //       value: "",
    //       isValid: false,
    //     },
    //   },
    //   false
    // );
  }, [commentSubmitHandler]);

  return (
    <>
      {auth.isLoggedIn ? (
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
      ) : (
        <div className="comment__center place-form">
          <p>Щоб залишати коментарі треба увійти в свій акаунт</p>
          <Button label="Увійти" onClick={() => navigate("/login")} />
        </div>
      )}
      {/* {isLoading && <LoadingSpinner />} */}
      {!isLoading && loadedComments && <CommentsList items={loadedComments} />}
    </>
  );
};

export default PostComments;
