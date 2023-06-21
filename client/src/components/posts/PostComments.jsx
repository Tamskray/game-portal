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
import { getPageCount, getPagesArray } from "../../utils/pages";

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

  const [limit, setLimit] = useState(2);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState("");
  let pagesArray = getPagesArray(totalPages);

  // console.log(pagesArray);
  const [loadedAllComments, setLoadedAllComments] = useState();

  const fetchAllComments = async (limit = 0, page = 0) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/comments/post/${postId}?limit=${limit}&page=${page}`
      );
      const responseData = await response.json();

      if (!response.ok) {
        // throw new Error(responseData.message);
        console.log(responseData.message);
      }

      setLoadedAllComments(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllComments();
    console.log("all comments fetched");
  }, []);

  const fetchComments = useCallback(async (limit = 2, page = 0) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/comments/post/${postId}?limit=${limit}&page=${page}`
      );

      const responseData = await response.json();

      // mb try check if comment by user exist

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      // console.log(response.json());
      const totalCount = response.headers.get("X-Total-Count");
      setTotalPages(getPageCount(totalCount, limit));

      // console.log(responseData);

      setLoadedComments(responseData);
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    console.log("refresh comments");

    fetchComments(limit, page);
  }, [fetchComments]);

  // totalPages && console.log(totalPages);

  const commentSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
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

      fetchAllComments();
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

  // loadedComments &&
  //   loadedComments.map((comment) => {
  //     if (auth.userId === comment.creatorId) {
  //       commentCreatedByUser = comment.creatorId;
  //     }
  //   });

  loadedAllComments &&
    !loadedAllComments.message &&
    loadedAllComments.map((comment) => {
      if (auth.userId === comment.creatorId) {
        commentCreatedByUser = comment.creatorId;
      }
    });

  const deleteCommentHandler = (deletedCommentId) => {
    setLoadedComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== deletedCommentId)
    );

    console.log("deleted");
    fetchAllComments();
    fetchComments();
  };

  // console.log(loadedComments);

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

  const changePageHandler = (page) => {
    setPage(page);
    console.log("Page " + page);
    fetchComments(limit, page);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {auth.isLoggedIn ? (
        commentCreatedByUser ? (
          <CommentsList
            items={loadedAllComments.filter(
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
      {/* {!loadedComments && !loadedAllComments && (
        <h3 className="center">Коментарів немає</h3>
      )} */}

      {loadedAllComments?.message && (
        <h3 className="center">Коментарів немає</h3>
      )}
      {pagesArray && pagesArray.length > 1 && (
        <div>
          {pagesArray.map((p) =>
            page === p ? (
              <Button
                key={p}
                label={p + 1}
                inverse
                onClick={() => changePageHandler(p)}
              />
            ) : (
              <Button
                key={p}
                label={p + 1}
                onClick={() => changePageHandler(p)}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default PostComments;
